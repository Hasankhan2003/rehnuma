import { NextRequest, NextResponse } from "next/server"
import { generateSolution, generateManimCode } from "@/lib/groq"
import { animationCache, solutionCache } from "@/lib/cache"
import { executeManimCode, validateManimInstallation } from "@/lib/manim-executor"
import { extractBearerToken, verifyToken } from "@/lib/auth"

// Validate Manim installation on module load (cached for the lifetime of the process)
let manimValidated = false
let manimValidationPassed = false
let validationAttempted = false

async function checkManimAvailability(): Promise<{ available: boolean; warning?: string }> {
  if (validationAttempted) {
    return {
      available: manimValidationPassed,
      warning: manimValidationPassed ? undefined : 'Previous Manim validation failed'
    }
  }

  console.log('[API] Checking Manim availability...')
  validationAttempted = true

  try {
    manimValidationPassed = await validateManimInstallation()

    if (manimValidationPassed) {
      console.log('[API] Manim validation successful')
      return { available: true }
    } else {
      console.warn('[API] Manim validation returned false - will attempt execution anyway')
      return {
        available: true, // Still allow execution
        warning: 'Manim validation unclear - execution will be attempted'
      }
    }
  } catch (error) {
    console.error('[API] Manim validation error:', error)
    return {
      available: true, // Still allow execution attempt
      warning: `Manim validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

export async function POST(request: NextRequest) {
  // ── Auth (Node.js runtime — jsonwebtoken works fully here) ──────────────
  const token = extractBearerToken(request.headers.get("Authorization"));
  if (!token || !verifyToken(token)) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or expired token. Please log in again." },
      { status: 401 }
    );
  }

  try {
    // Parse request body
    const body = await request.json()
    const { query } = body

    // Validate input
    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Invalid request: 'query' is required and must be a string" },
        { status: 400 }
      )
    }

    if (query.trim().length === 0) {
      return NextResponse.json(
        { error: "Query cannot be empty" },
        { status: 400 }
      )
    }

    // Check animation cache first
    const cachedAnimation = animationCache.get(query)
    if (cachedAnimation) {
      console.log("[API] Returning cached animation")
      return NextResponse.json({
        ...cachedAnimation,
        cached: true,
      })
    }

    console.log("[API] Generating new animation for query:", query.substring(0, 100))

    // Check Manim availability (non-blocking check)
    const manimCheck = await checkManimAvailability()
    if (manimCheck.warning) {
      console.warn('[API] Manim check warning:', manimCheck.warning)
      // Continue anyway - let actual execution determine if it works
    }

    // Step 1: Generate solution first (for buffering)
    let solution
    const cachedSolution = solutionCache.get(query)

    if (cachedSolution) {
      console.log("[API] Using cached solution for animation")
      solution = cachedSolution
    } else {
      console.log("[API] Generating solution for animation")
      const solutionStartTime = Date.now()
      solution = await generateSolution(query)

      // Cache the solution
      solutionCache.set(query, solution)
      console.log(`[API] Solution generated in ${((Date.now() - solutionStartTime) / 1000).toFixed(2)}s`)
    }

    // Step 2: Generate Manim code
    console.log("[API] Generating Manim code")
    const manimStartTime = Date.now()
    const manimCode = await generateManimCode(query)
    console.log(`[API] Manim code generated in ${((Date.now() - manimStartTime) / 1000).toFixed(2)}s`)

    // Step 3: Execute Manim and generate video
    console.log("[API] Executing Manim to generate video")
    const executionStartTime = Date.now()

    const { videoUrl, animationId, attempts, fixedErrors } = await executeManimCode(manimCode, query)

    const totalProcessingTime = ((Date.now() - manimStartTime) / 1000).toFixed(2) + "s"

    if (fixedErrors && fixedErrors.length > 0) {
      console.log(`[API] Video generated with ${fixedErrors.length} auto-fixed error(s):`, fixedErrors)
    } else {
      console.log(`[API] Video generated successfully in ${totalProcessingTime}`)
    }

    // Prepare response
    const result = {
      video_url: videoUrl,
      processing_time: totalProcessingTime,
      attempts,
      fixed_errors: fixedErrors, // Include information about fixed errors
      animation_id: animationId,
      solution: {
        answer: solution.answer,
        processing_time: solution.processing_time,
        sources: solution.sources,
      },
    }

    // Cache the animation result
    animationCache.set(query, result)

    return NextResponse.json({
      ...result,
      cached: false,
    })
  } catch (error) {
    console.error("[API] Error in generate-animation:", error)

    // Return user-friendly error
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"

    // Parse error type for better user feedback
    let userMessage = "Failed to generate animation. Please try again."
    let statusCode = 500

    if (errorMessage.includes("Manim is not installed") || errorMessage.includes("Manim is not available")) {
      userMessage = "Animation service is not available. Manim is not installed or configured."
      statusCode = 503
    } else if (errorMessage.includes("manim") || errorMessage.includes("Video file not found")) {
      userMessage = "Animation generation failed. This could be due to a rendering issue or complex query."
    } else if (errorMessage.includes("timeout") || errorMessage.includes("killed")) {
      userMessage = "Animation generation timed out. Please try a simpler query or problem."
    } else if (errorMessage.includes("LaTeX")) {
      userMessage = "Failed to render mathematical formulas. Please check the problem formatting."
    } else if (errorMessage.includes("Python") || errorMessage.includes("syntax")) {
      userMessage = "Code generation error. Please try rephrasing your question."
    } else if (errorMessage.includes("API") || errorMessage.includes("GROQ")) {
      userMessage = "AI service error. Please try again in a moment."
    }

    // Include troubleshooting in response
    return NextResponse.json(
      {
        error: errorMessage,
        message: userMessage,
        details: "If this issue persists, please try: 1) Simplifying your query, 2) Checking Manim installation, 3) Verifying your internet connection",
        timestamp: new Date().toISOString(),
      },
      { status: statusCode }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to generate animations." },
    { status: 405 }
  )
}
