/**
 * POST /api/auth/signup
 * Accepts: { username, email, password }
 * Hashes password and stores user in PostgreSQL.
 */
import { NextRequest, NextResponse } from "next/server";
import { query, setupDatabase } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

let dbReady = false;

export async function POST(request: NextRequest) {
  // Ensure table exists on first call
  if (!dbReady) {
    await setupDatabase();
    dbReady = true;
  }

  try {
    const body = await request.json();
    const { username, email, password } = body;

    // --- Input Validation ---
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required." },
        { status: 400 }
      );
    }
    if (username.length < 3 || username.length > 50) {
      return NextResponse.json(
        { error: "Username must be between 3 and 50 characters." },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // --- Check for duplicates ---
    const existing = await query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [email.toLowerCase(), username]
    );
    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json(
        { error: "A user with that email or username already exists." },
        { status: 409 }
      );
    }

    // --- Hash & Insert ---
    const hashedPassword = await hashPassword(password);
    const result = await query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email.toLowerCase(), hashedPassword]
    );

    const newUser = result.rows[0];
    console.log(`[Auth] New user signed up: ${newUser.email}`);

    return NextResponse.json(
      { message: "Account created successfully!", user: { id: newUser.id, username: newUser.username, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Auth] Signup error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
