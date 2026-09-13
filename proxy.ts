import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const pathname = request.nextUrl.pathname;

  const authPaths = ["/login", "/register", "/forgot-password", "/update-password"];
  const isAuthPage = authPaths.includes(pathname);
  const isDashboardPage = pathname.startsWith("/dashboard");

  // Jika user sudah memiliki session cookie dan mencoba membuka auth pages -> redirect ke dashboard
  if (sessionCookie && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Jika user belum login dan mencoba membuka halaman protected (dashboard) -> redirect ke login
  if (!sessionCookie && isDashboardPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};