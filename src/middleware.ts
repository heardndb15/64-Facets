import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware — can be used for auth guards once Supabase Auth is wired.
 * For MVP, we pass through all routes.
 */
export function middleware(request: NextRequest) {
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
