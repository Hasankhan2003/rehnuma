/**
 * GET /api/auth/me
 * Validates the Bearer token and returns current user info.
 * Used by the frontend to verify session on page load.
 */
import { NextRequest, NextResponse } from "next/server";
import { extractBearerToken, verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = extractBearerToken(authHeader);

  if (!token) {
    return NextResponse.json({ error: "No token provided." }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid or expired token." }, { status: 401 });
  }

  return NextResponse.json({
    user: { userId: payload.userId, email: payload.email, username: payload.username },
  });
}
