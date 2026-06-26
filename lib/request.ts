import type { NextRequest } from "next/server";
import { ApiError } from "@/lib/api-errors";

export async function readJson(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "bad_request", "Request body must be valid JSON.");
  }
}

export function getSearchParams(request: NextRequest) {
  return Object.fromEntries(request.nextUrl.searchParams.entries());
}

export function requireWebhookSecret(request: NextRequest, expectedSecret?: string) {
  if (!expectedSecret) {
    return;
  }

  const providedSecret =
    request.headers.get("x-webhook-secret") ??
    request.headers.get("x-easysub-webhook-secret") ??
    request.nextUrl.searchParams.get("secret");

  if (providedSecret !== expectedSecret) {
    throw new ApiError(401, "unauthorized", "Invalid webhook secret.");
  }
}
