import { NextRequest, NextResponse } from "next/server";
import {
  createPaymentSuccessToken,
  getPaymentSuccessCookieOptions,
  PAYMENT_SUCCESS_COOKIE_NAME
} from "@/lib/payment-success-session";
import { finalizeZiniPayInvoice } from "@/lib/zinipay-order";
import { ZINIPAY_INVOICE_COOKIE } from "@/lib/zinipay";

export async function GET(request: NextRequest) {
  const invoiceId = readInvoiceId(request);

  if (!invoiceId) {
    return redirectToCheckout(request);
  }

  try {
    const result = await finalizeZiniPayInvoice(invoiceId);
    const token = await createPaymentSuccessToken({
      orderId: result.order.id,
      invoiceId
    });
    const response = NextResponse.redirect(new URL("/payment/success", request.url), 303);

    response.cookies.set(PAYMENT_SUCCESS_COOKIE_NAME, token, getPaymentSuccessCookieOptions());
    expireInvoiceCookie(response);
    response.headers.set("Cache-Control", "no-store");

    return response;
  } catch {
    return redirectToCheckout(request);
  }
}

function readInvoiceId(request: NextRequest) {
  return (
    request.nextUrl.searchParams.get("invoice_id") ??
    request.nextUrl.searchParams.get("invoiceId") ??
    request.nextUrl.searchParams.get("invoice") ??
    request.cookies.get(ZINIPAY_INVOICE_COOKIE)?.value
  );
}

function redirectToCheckout(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/checkout", request.url), 303);

  expireInvoiceCookie(response);
  response.headers.set("Cache-Control", "no-store");

  return response;
}

function expireInvoiceCookie(response: NextResponse) {
  response.cookies.set(ZINIPAY_INVOICE_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}
