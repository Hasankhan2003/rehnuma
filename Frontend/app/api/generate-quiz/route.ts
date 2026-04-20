/**
 * POST /api/generate-quiz
 * Generates 5 MCQs for the given query using Groq LLM.
 * Checks quizCache first; optionally enriches prompt with cached solution.
 * Auth: JWT Bearer required (enforced by middleware.ts)
 */
import { NextRequest, NextResponse } from "next/server"
import { generateQuiz } from "@/lib/groq"
import { quizCache, solutionCache } from "@/lib/cache"
import { extractBearerToken, verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  // ── Auth ──────────────────────────────────────────────────────────────────
  const authHeader = request.headers.get("Authorization")
  const token = extractBearerToken(authHeader)
  const payload = token ? verifyToken(token) : null
  if (!payload) {
    return NextResponse.json(
      { error: "Unauthorized: Please log in." },
      { status: 401 }
    )
  }

  // ── Parse Body ────────────────────────────────────────────────────────────
  let query: string
  let fresh = false
  try {
    const body = await request.json()
    query = (body.query ?? "").trim()
    fresh = body.fresh === true
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!query) {
    return NextResponse.json(
      { error: "Query is required." },
      { status: 400 }
    )
  }
  if (query.length < 5) {
    return NextResponse.json(
      { error: "Query is too short. Please provide a meaningful question." },
      { status: 400 }
    )
  }

  // ── Cache Check ───────────────────────────────────────────────────────────
  if (!fresh) {
    const cached = quizCache.get(query)
    if (cached) {
      console.log(`[Quiz] Cache HIT for query: "${query.substring(0, 60)}"`)
      return NextResponse.json({ ...cached, cached: true })
    }
  }

  // ── Generate ──────────────────────────────────────────────────────────────
  console.log(`[Quiz] Generating quiz for: "${query.substring(0, 60)}"`)

  // Optionally enrich with cached solution for better question context
  const cachedSolution = solutionCache.get(query)
  const solutionText = cachedSolution?.answer ?? undefined

  try {
    const result = await generateQuiz(query, solutionText)
    const processingTime = ((Date.now() - startTime) / 1000).toFixed(2) + "s"

    const responsePayload = {
      quiz: result.quiz,
      query,
      cached: false,
      processing_time: processingTime,
      context_enhanced: !!solutionText,
    }

    quizCache.set(query, responsePayload)
    return NextResponse.json(responsePayload)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate quiz."
    console.error("[Quiz] Generation error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
