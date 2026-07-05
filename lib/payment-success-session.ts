import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { getJwtSecret } from "@/lib/env";

export const PAYMENT_SUCCESS_COOKIE_NAME = "easysub_payment_success";

const PAYMENT_SUCCESS_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const PAYMENT_SUCCESS_AUDIENCE = "payment-success";
const PAYMENT_SUCCESS_ISSUER = "bd-subscription-hub";

export type PaymentSuccessSession = {
  orderId: number;
  paymentId: string;
};

type PaymentSuccessJwtPayload = {
  orderId?: unknown;
  paymentId?: unknown;
  purpose?: unknown;
};

export async function createPaymentSuccessToken(session: PaymentSuccessSession) {
  const secret = new TextEncoder().encode(getJwtSecret());

  return new SignJWT({
    orderId: session.orderId,
    paymentId: session.paymentId,
    purpose: PAYMENT_SUCCESS_AUDIENCE
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(PAYMENT_SUCCESS_ISSUER)
    .setAudience(PAYMENT_SUCCESS_AUDIENCE)
    .setSubject(String(session.orderId))
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + PAYMENT_SUCCESS_MAX_AGE_SECONDS)
    .sign(secret);
}

export function getPaymentSuccessCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/payment",
    maxAge: PAYMENT_SUCCESS_MAX_AGE_SECONDS
  };
}

export async function readPaymentSuccessSession() {
  const token = (await cookies()).get(PAYMENT_SUCCESS_COOKIE_NAME)?.value;
  return verifyPaymentSuccessToken(token);
}

export async function verifyPaymentSuccessToken(token?: string | null) {
  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(getJwtSecret());
    const { payload } = await jwtVerify(token, secret, {
      issuer: PAYMENT_SUCCESS_ISSUER,
      audience: PAYMENT_SUCCESS_AUDIENCE
    });
    const parsedPayload = payload as PaymentSuccessJwtPayload;

    if (
      parsedPayload.purpose !== PAYMENT_SUCCESS_AUDIENCE ||
      typeof parsedPayload.orderId !== "number" ||
      !Number.isInteger(parsedPayload.orderId) ||
      parsedPayload.orderId <= 0 ||
      typeof parsedPayload.paymentId !== "string" ||
      parsedPayload.paymentId.trim().length < 1
    ) {
      return null;
    }

    return {
      orderId: parsedPayload.orderId,
      paymentId: parsedPayload.paymentId
    } satisfies PaymentSuccessSession;
  } catch {
    return null;
  }
}
