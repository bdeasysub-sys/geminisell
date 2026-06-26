import { timingSafeEqual } from "crypto";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { ApiError } from "@/lib/api-errors";
import {
  getAdminCredentials,
  getJwtExpiresInSeconds,
  getJwtSecret
} from "@/lib/env";

export const ADMIN_COOKIE_NAME = "easysub_admin_token";

type AdminTokenPayload = {
  email: string;
  role: "admin";
};

export async function createAdminToken(email: string) {
  const expiresIn = getJwtExpiresInSeconds();
  const secret = new TextEncoder().encode(getJwtSecret());

  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresIn)
    .sign(secret);
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getJwtExpiresInSeconds()
  };
}

export async function verifyAdminToken(token?: string | null) {
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(getJwtSecret());
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== "admin" || typeof payload.email !== "string") {
      return null;
    }

    return payload as AdminTokenPayload;
  } catch {
    return null;
  }
}

export async function requireAdmin(request?: NextRequest) {
  const token =
    request?.cookies.get(ADMIN_COOKIE_NAME)?.value ??
    (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  const payload = await verifyAdminToken(token);

  if (!payload) {
    throw new ApiError(401, "unauthorized", "Admin authentication required.");
  }

  return payload;
}

export function validateAdminCredentials(email: string, password: string) {
  const credentials = getAdminCredentials();
  const emailMatches = safeEqual(email.toLowerCase(), credentials.email);
  const passwordMatches = safeEqual(password, credentials.password);

  return emailMatches && passwordMatches;
}

function safeEqual(input: string, expected: string) {
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  if (inputBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(inputBuffer, expectedBuffer);
}
