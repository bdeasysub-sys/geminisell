import { NextRequest, NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-errors";
import { finalizeZiniPayInvoice } from "@/lib/zinipay-order";
import { assertRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  return withApiErrorHandling(async () => {
    assertRateLimit(request, {
      keyPrefix: "zinipay-webhook",
      max: 120,
      windowMs: 60 * 1000
    });

    const payload = await readMaybeJson(request);
    const invoiceId = readInvoiceId(payload, request);

    if (!invoiceId) {
      throw new ApiError(400, "bad_request", "Missing ZiniPay invoice ID.");
    }

    const result = await finalizeZiniPayInvoice(invoiceId);

    return NextResponse.json({
      ok: true,
      message: result.message,
      orderId: result.order.id
    });
  });
}

async function readMaybeJson(request: NextRequest) {
  const text = await request.text();

  if (!text.trim()) {
    return {};
  }

  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function readInvoiceId(payload: Record<string, unknown>, request: NextRequest) {
  return (
    readString(payload, "invoice_id", "invoiceId", "invoice") ??
    request.nextUrl.searchParams.get("invoice_id") ??
    request.nextUrl.searchParams.get("invoiceId")
  );
}

function readString(record: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return undefined;
}
