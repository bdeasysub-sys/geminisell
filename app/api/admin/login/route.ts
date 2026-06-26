import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  getAdminCookieOptions,
  validateAdminCredentials
} from "@/lib/auth";
import { ApiError, withApiErrorHandling } from "@/lib/api-errors";
import { assertRateLimit } from "@/lib/rate-limit";
import { readJson } from "@/lib/request";
import { adminLoginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  return withApiErrorHandling(async () => {
    assertRateLimit(request, {
      keyPrefix: "admin-login",
      max: 5,
      windowMs: 15 * 60 * 1000
    });

    const input = adminLoginSchema.parse(await readJson(request));

    if (!validateAdminCredentials(input.email, input.password)) {
      throw new ApiError(401, "unauthorized", "Invalid admin credentials.");
    }

    const token = await createAdminToken(input.email);
    const response = NextResponse.json({
      ok: true,
      admin: {
        email: input.email
      }
    });

    response.cookies.set(ADMIN_COOKIE_NAME, token, getAdminCookieOptions());
    return response;
  });
}
