import { NextRequest, NextResponse } from "next/server";
import { ApiError, StockUnavailableError, withApiErrorHandling } from "@/lib/api-errors";
import { getZiniPayAmount } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { assertRateLimit } from "@/lib/rate-limit";
import { readJson } from "@/lib/request";
import { demoCheckoutSchema } from "@/lib/validation";
import { createZiniPayPayment, ZINIPAY_INVOICE_COOKIE } from "@/lib/zinipay";

export async function POST(request: NextRequest) {
  return withApiErrorHandling(async () => {
    assertRateLimit(request, {
      keyPrefix: "zinipay-create",
      max: 20,
      windowMs: 60 * 1000
    });

    const input = demoCheckoutSchema.parse(await readJson(request));

    const existingCustomerOrder = await prisma.order.findFirst({
      where: {
        OR: [{ email: input.email }, { phone: input.phone }]
      }
    });

    if (existingCustomerOrder) {
      throw new ApiError(409, "conflict", "An order already exists with this email or phone number.");
    }

    const availableLinks = await prisma.link.count({
      where: { status: "available" }
    });

    if (availableLinks < 1) {
      throw new StockUnavailableError();
    }

    const amount = getZiniPayAmount();
    const payment = await createZiniPayPayment({
      ...input,
      amount
    });

    await prisma.paymentIntent.create({
      data: {
        invoiceId: payment.invoiceId,
        paymentUrl: payment.paymentUrl,
        customerName: input.customerName,
        email: input.email,
        phone: input.phone,
        amount
      }
    });

    const response = NextResponse.json(
      {
        ok: true,
        message: "Payment invoice created.",
        invoiceId: payment.invoiceId,
        paymentUrl: payment.paymentUrl
      },
      { status: 201 }
    );

    response.cookies.set(ZINIPAY_INVOICE_COOKIE, payment.invoiceId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60
    });

    return response;
  });
}
