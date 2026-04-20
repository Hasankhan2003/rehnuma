/**
 * GET /api/dashboard
 * Returns quiz attempt history and aggregate stats for the authenticated user.
 * Auth: JWT Bearer required.
 */
import { NextRequest, NextResponse } from "next/server"
import { query as dbQuery, setupQuizTable } from "@/lib/db"
import { extractBearerToken, verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
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

  try {
    await setupQuizTable() // idempotent — safe to call on every request

    // ── Fetch Attempts ────────────────────────────────────────────────────
    const attemptsResult = await dbQuery(
      `SELECT
         id,
         query,
         score,
         total_questions,
         created_at,
         quiz_data
       FROM quiz_attempts
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId]
    )

    const attempts = attemptsResult.rows.map((row) => ({
      id: row.id,
      query: row.query,
      score: row.score,
      total_questions: row.total_questions,
      percentage: Math.round((row.score / row.total_questions) * 100),
      created_at: row.created_at,
      quiz_data: row.quiz_data,
    }))

    // ── Aggregate Stats ───────────────────────────────────────────────────
    const totalAttempts = attempts.length

    const stats =
      totalAttempts === 0
        ? {
            total_attempts: 0,
            average_score: 0,
            best_score: 0,
            average_percentage: 0,
          }
        : {
            total_attempts: totalAttempts,
            average_score:
              Math.round(
                (attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts) * 10
              ) / 10,
            best_score: Math.max(...attempts.map((a) => a.score)),
            average_percentage:
              Math.round(
                attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts
              ),
          }

    return NextResponse.json({ stats, attempts })
  } catch (error) {
    console.error("[Dashboard] DB query error:", error)
    return NextResponse.json(
      { error: "Failed to load dashboard data." },
      { status: 500 }
    )
  }
}
