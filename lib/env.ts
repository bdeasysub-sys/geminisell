import { ApiError } from "@/lib/api-errors";

const CHECKOUT_URL = "/checkout";

export function getOptionalEnv(name: string) {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export function getRequiredEnv(name: string) {
  const value = getOptionalEnv(name);

  if (!value) {
    throw new ApiError(
      500,
      "configuration_error",
      `Missing required environment variable: ${name}`
    );
  }

  return value;
}

export function getCheckoutUrl() {
  return CHECKOUT_URL;
}

export function getSiteUrl() {
  return (getOptionalEnv("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000").replace(/\/+$/, "");
}

export function getZiniPayApiKey() {
  return getRequiredEnv("ZINIPAY_API_KEY");
}

export function getZiniPayAmount() {
  const value = getOptionalEnv("ZINIPAY_AMOUNT") ?? "590";
  const amount = Number(value);

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new ApiError(
      500,
      "configuration_error",
      "ZINIPAY_AMOUNT must be a positive whole number."
    );
  }

  return amount;
}

export function getAdminCredentials() {
  return {
    email: getRequiredEnv("ADMIN_EMAIL").toLowerCase(),
    password: getRequiredEnv("ADMIN_PASSWORD")
  };
}

export function getJwtSecret() {
  const secret = getRequiredEnv("JWT_SECRET");

  if (secret.length < 32) {
    throw new ApiError(
      500,
      "configuration_error",
      "JWT_SECRET must be at least 32 characters."
    );
  }

  return secret;
}

export function getJwtExpiresInSeconds() {
  return parseDurationToSeconds(getOptionalEnv("JWT_EXPIRES_IN") ?? "7d");
}

export function getWebhookSecret() {
  return getOptionalEnv("PAYMENT_WEBHOOK_SECRET");
}

export function parseDurationToSeconds(value: string) {
  const match = value.match(/^(\d+)([smhd])?$/i);

  if (!match) {
    throw new ApiError(
      500,
      "configuration_error",
      "JWT_EXPIRES_IN must look like 30m, 12h, 7d, or a number of seconds."
    );
  }

  const amount = Number(match[1]);
  const unit = (match[2] ?? "s").toLowerCase();

  if (unit === "s") return amount;
  if (unit === "m") return amount * 60;
  if (unit === "h") return amount * 60 * 60;
  return amount * 60 * 60 * 24;
}
