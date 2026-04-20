/**
 * POST /api/auth/login
 * Accepts: { email, password }
 * Returns: { token, user } if credentials are valid.
 */
import { NextRequest, NextResponse } from "next/server";
import { query, setupDatabase } from "@/lib/db";
import { verifyPassword, generateToken } from "@/lib/auth";

let dbReady = false;

export async function POST(request: NextRequest) {
  if (!dbReady) {
    await setupDatabase();
    dbReady = true;
  }

  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Find user by email
    const result = await query(
      "SELECT id, username, email, password FROM users WHERE email = $1",
      [email.toLowerCase()]
    );

    if (!result.rowCount || result.rowCount === 0) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = generateToken({ userId: user.id, email: user.email, username: user.username });

    console.log(`[Auth] User logged in: ${user.email}`);

    return NextResponse.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("[Auth] Login error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
