import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE_NAME = "easysub_admin_token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  const isLogin = pathname === "/admin/login";
  const isProtectedAdminPage = pathname.startsWith("/admin/dashboard");
  const validSession = await hasValidAdminSession(request);

  if (isLogin && validSession) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (isProtectedAdminPage && !validSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};

async function hasValidAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const secret = process.env.JWT_SECRET;

  if (!token || !secret || secret.length < 32) {
    return false;
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.role === "admin";
  } catch {
    return false;
  }
}
