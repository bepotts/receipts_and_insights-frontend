import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LANDING_PATH = "/landing";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("session_token")?.value;

  const isLandingPage = pathname === LANDING_PATH;
  if (isLandingPage && !sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
