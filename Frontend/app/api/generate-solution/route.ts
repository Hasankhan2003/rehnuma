import { NextRequest, NextResponse } from "next/server"
import { generateSolution } from "@/lib/groq"
import { solutionCache } from "@/lib/cache"
import { extractBearerToken, verifyToken } from "@/lib/auth"

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

    // Check cache first
    const cachedResult = solutionCache.get(query)
    if (cachedResult) {
      console.log("[API] Returning cached solution")
      return NextResponse.json({
        ...cachedResult,
        cached: true,
      })
    }

    // Generate new solution
    console.log("[API] Generating new solution for query:", query.substring(0, 100))
    const result = await generateSolution(query)

    // Cache the result
    solutionCache.set(query, result)

    return NextResponse.json({
      ...result,
      cached: false,
    })
  } catch (error) {
    console.error("[API] Error in generate-solution:", error)

    // Return user-friendly error
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"

    return NextResponse.json(
      {
        error: errorMessage,
        details: "Failed to generate solution. Please try again or rephrase your question."
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to generate solutions." },
    { status: 405 }
  )
}
