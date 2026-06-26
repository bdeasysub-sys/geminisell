import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ErrorCode =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "rate_limited"
  | "stock_unavailable"
  | "validation_error"
  | "configuration_error"
  | "payment_gateway_error"
  | "internal_error";

export class ApiError extends Error {
  status: number;
  code: ErrorCode;
  details?: unknown;

  constructor(status: number, code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class StockUnavailableError extends ApiError {
  constructor() {
    super(409, "stock_unavailable", "Sorry, currently stock unavailable.");
  }
}

export function validationError(details: unknown) {
  return new ApiError(422, "validation_error", "Validation failed.", details);
}

export function assertFound<T>(value: T | null | undefined, message = "Not found."): T {
  if (!value) {
    throw new ApiError(404, "not_found", message);
  }

  return value;
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "validation_error",
          message: "Validation failed.",
          details: error.flatten()
        }
      },
      { status: 422 }
    );
  }

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      },
      { status: error.status }
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target)
        ? error.meta.target.join(", ")
        : String(error.meta?.target ?? "");
      const message =
        target.includes("email") || target.includes("phone")
          ? "An order already exists with this email or phone number."
          : "A record with this unique value already exists.";

      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "conflict",
            message,
            details: error.meta
          }
        },
        { status: 409 }
      );
    }
  }

  console.error(error);

  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "internal_error",
        message: "Something went wrong."
      }
    },
    { status: 500 }
  );
}

export async function withApiErrorHandling<T extends Response>(
  handler: () => Promise<T>
): Promise<T | NextResponse> {
  try {
    return await handler();
  } catch (error) {
    return handleApiError(error);
  }
}
