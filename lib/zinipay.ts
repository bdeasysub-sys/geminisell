import { ApiError } from "@/lib/api-errors";
import { getSiteUrl, getZiniPayApiKey } from "@/lib/env";

const ZINIPAY_BASE_URL = "https://api.zinipay.com/v1/payment";

export const ZINIPAY_INVOICE_COOKIE = "easysub_zinipay_invoice";

type ZiniPayResponse = Record<string, unknown>;

export type ZiniPayCreatePaymentInput = {
  customerName: string;
  email: string;
  phone: string;
  amount: number;
};

export type ZiniPayCreatePaymentResult = {
  invoiceId: string;
  paymentUrl: string;
  raw: ZiniPayResponse;
};

export type ZiniPayVerificationResult = {
  invoiceId: string;
  status: "pending" | "completed" | "failed" | "canceled";
  transactionId?: string;
  paymentMethod?: string;
  amount?: number;
  customerEmail?: string;
  raw: ZiniPayResponse;
};

export async function createZiniPayPayment(input: ZiniPayCreatePaymentInput) {
  const siteUrl = getSiteUrl();
  const payload = {
    cus_name: input.customerName,
    cus_email: input.email,
    cus_phone: input.phone,
    amount: input.amount,
    redirect_url: `${siteUrl}/payment/zinipay/return`,
    success_url: `${siteUrl}/payment/zinipay/return`,
    cancel_url: `${siteUrl}/demo-checkout?payment=cancelled`,
    webhook_url: `${siteUrl}/api/zinipay/webhook`,
    metadata: {
      product: "gemini-pro-18-months",
      source: "easysub"
    }
  };

  const response = await callZiniPay("/create", payload);
  const paymentUrl = readString(response, "payment_url", "paymentUrl", "url", "redirect_url");
  const invoiceId =
    readString(response, "invoice_id", "invoiceId", "invoice", "id") ??
    (paymentUrl ? extractInvoiceId(paymentUrl) : undefined);

  if (!paymentUrl || !invoiceId) {
    throw new ApiError(
      502,
      "payment_gateway_error",
      "ZiniPay did not return a usable payment URL.",
      response
    );
  }

  return {
    invoiceId,
    paymentUrl,
    raw: response
  } satisfies ZiniPayCreatePaymentResult;
}

export async function verifyZiniPayPayment(invoiceId: string) {
  const response = await callZiniPay("/verify", {
    invoice_id: invoiceId,
    invoiceId
  });

  return {
    invoiceId: readString(response, "invoice_id", "invoiceId", "invoice") ?? invoiceId,
    status: normalizeStatus(readString(response, "status", "payment_status", "paymentStatus")),
    transactionId: readString(response, "transaction_id", "transactionId", "trx_id", "trxId"),
    paymentMethod: readString(response, "payment_method", "paymentMethod", "method"),
    amount: readNumber(response, "amount", "paid_amount", "paidAmount"),
    customerEmail: readString(response, "cus_email", "customer_email", "email"),
    raw: response
  } satisfies ZiniPayVerificationResult;
}

async function callZiniPay(path: string, payload: Record<string, unknown>) {
  let response: Response;

  try {
    response = await fetch(`${ZINIPAY_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "zini-api-key": getZiniPayApiKey(),
        "content-type": "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store"
    });
  } catch {
    throw new ApiError(
      502,
      "payment_gateway_error",
      "Unable to connect to ZiniPay right now."
    );
  }

  const data = await readResponse(response);

  if (!response.ok) {
    throw new ApiError(
      502,
      "payment_gateway_error",
      readString(data, "message", "error") ?? "ZiniPay request failed.",
      data
    );
  }

  return data;
}

async function readResponse(response: Response): Promise<ZiniPayResponse> {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? (parsed as ZiniPayResponse) : { value: parsed };
  } catch {
    return { message: text };
  }
}

function readString(record: ZiniPayResponse, ...keys: string[]) {
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

function readNumber(record: ZiniPayResponse, ...keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    const numberValue = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;

    if (Number.isFinite(numberValue)) {
      return numberValue;
    }
  }

  return undefined;
}

function normalizeStatus(value?: string): ZiniPayVerificationResult["status"] {
  const normalized = value?.toLowerCase().trim();

  if (["success", "successful", "complete", "completed", "paid", "approved"].includes(normalized ?? "")) {
    return "completed";
  }

  if (["cancel", "cancelled", "canceled"].includes(normalized ?? "")) {
    return "canceled";
  }

  if (["failed", "fail", "rejected", "declined"].includes(normalized ?? "")) {
    return "failed";
  }

  return "pending";
}

function extractInvoiceId(paymentUrl: string) {
  try {
    const url = new URL(paymentUrl);
    return (
      url.searchParams.get("invoice_id") ??
      url.searchParams.get("invoiceId") ??
      url.pathname.split("/").filter(Boolean).at(-1)
    );
  } catch {
    return paymentUrl.split("/").filter(Boolean).at(-1);
  }
}
