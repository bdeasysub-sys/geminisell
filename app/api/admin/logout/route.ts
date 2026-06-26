import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";
import { withApiErrorHandling } from "@/lib/api-errors";

export async function POST() {
  return withApiErrorHandling(async () => {
    const response = NextResponse.json({ ok: true });

    response.cookies.set(ADMIN_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0
    });

    return response;
  });
}
