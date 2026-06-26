import type { NextRequest } from "next/server";
import { ApiError } from "@/lib/api-errors";

type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  keyPrefix: string;
  max: number;
  windowMs: number;
};

const buckets = new Map<string, Bucket>();

export function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return realIp?.trim() || "unknown";
}

export function assertRateLimit(request: NextRequest, options: RateLimitOptions) {
  const now = Date.now();
  const key = `${options.keyPrefix}:${getClientIp(request)}`;
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + options.windowMs
    });
    cleanupExpiredBuckets(now);
    return;
  }

  existing.count += 1;

  if (existing.count > options.max) {
    const retryAfterSeconds = Math.ceil((existing.resetAt - now) / 1000);
    throw new ApiError(429, "rate_limited", "Too many requests.", {
      retryAfterSeconds
    });
  }
}

function cleanupExpiredBuckets(now: number) {
  if (buckets.size < 5000) return;

  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}
