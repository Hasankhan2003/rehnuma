/**
 * POST /api/submit-quiz
 * Calculates score, stores attempt in quiz_attempts table.
 * Auth: JWT Bearer required — userId extracted from token.
 */
import { NextRequest, NextResponse } from "next/server"
import { query as dbQuery, setupQuizTable } from "@/lib/db"
import { extractBearerToken, verifyToken } from "@/lib/auth"
import type { QuizItem } from "@/lib/groq"

interface SubmitBody {
  query: string
  answers: string[]       // user's selected option texts, one per question
  quiz_data: QuizItem[]   // full quiz from generate-quiz response
}

interface BreakdownItem {
  question: string
  user_answer: string
  correct_answer: string
  correct: boolean
  explanation: string
}

export async function POST(request: NextRequest) {
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
  const userId = payload.userId

  // ── Parse Body ────────────────────────────────────────────────────────────
  let body: SubmitBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const { query: quizQuery, answers, quiz_data } = body

  if (!quizQuery || !answers || !quiz_data) {
    return NextResponse.json(
      { error: "Missing required fields: query, answers, quiz_data." },
      { status: 400 }
    )
  }
  if (!Array.isArray(answers) || !Array.isArray(quiz_data)) {
    return NextResponse.json(
      { error: "answers and quiz_data must be arrays." },
      { status: 400 }
    )
  }
  if (answers.length !== quiz_data.length) {
    return NextResponse.json(
      { error: "answers length must match quiz_data length." },
      { status: 400 }
    )
  }

  // ── Score Calculation ─────────────────────────────────────────────────────
  const correctAnswers = quiz_data.map((item) => item.correct_answer)
  const breakdown: BreakdownItem[] = quiz_data.map((item, i) => ({
    question: item.question,
    user_answer: answers[i] ?? "",
    correct_answer: item.correct_answer,
    correct: answers[i] === item.correct_answer,
    explanation: item.explanation,
  }))
  const score = breakdown.filter((b) => b.correct).length
  const total = quiz_data.length
  const percentage = Math.round((score / total) * 100)

  // ── DB Insert ─────────────────────────────────────────────────────────────
  try {
    await setupQuizTable() // idempotent — ensures table exists
    await dbQuery(
      `INSERT INTO quiz_attempts
         (user_id, query, score, total_questions, answers, correct_answers, quiz_data)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb)`,
      [
        userId,
        quizQuery,
        score,
        total,
        JSON.stringify(answers),
        JSON.stringify(correctAnswers),
        JSON.stringify(quiz_data),
      ]
    )
    console.log(`[Quiz] Stored attempt for user ${userId} — score: ${score}/${total}`)
  } catch (error) {
    console.error("[Quiz] DB insert error:", error)
    return NextResponse.json(
      { error: "Failed to save quiz attempt. Please try again." },
      { status: 500 }
    )
  }

  return NextResponse.json({
    score,
    total,
    percentage,
    breakdown,
  })
}
