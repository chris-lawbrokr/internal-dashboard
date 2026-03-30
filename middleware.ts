import { NextRequest, NextResponse } from "next/server";

/*
Route Protection Middleware
Checks for the session marker cookie and redirects unauthenticated
users to /login. The session cookie is set client-side after login.

The actual access token lives in-memory (not in cookies), so this
middleware only provides a first line of defense. Real auth validation
happens on the backend when the Bearer token is sent.
*/

const PUBLIC_PATHS = ["/login", "/_next", "/images", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const session = request.cookies.get("session")?.value;

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
