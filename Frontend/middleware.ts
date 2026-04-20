/**
 * middleware.ts — Next.js Middleware
 *
 * NOTE: JWT verification via `jsonwebtoken` is NOT reliable in the Next.js
 * Edge runtime (middleware context) because jsonwebtoken uses Node.js crypto
 * APIs that are not fully supported in the Edge runtime.
 *
 * Auth is handled inside each individual API route handler instead,
 * where the Node.js runtime provides full jsonwebtoken compatibility:
 *   - /api/generate-solution/route.ts
 *   - /api/generate-animation/route.ts
 *   - /api/generate-quiz/route.ts
 *   - /api/submit-quiz/route.ts
 *   - /api/dashboard/route.ts
 */
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Pass all requests through — auth is verified in route handlers
  return NextResponse.next();
}

export const config = {
  matcher: [],  // No routes intercepted at middleware level
};

