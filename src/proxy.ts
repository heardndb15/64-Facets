import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy — handles all requests (Next.js 16 renamed middleware to proxy).
 * For MVP, we pass through all routes.
 */
export function proxy(request: NextRequest) {
  // TODO: Add Supabase session check here for protected routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
