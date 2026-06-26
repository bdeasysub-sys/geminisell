import { NextRequest, NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-errors";
import { finalizeZiniPayInvoice } from "@/lib/zinipay-order";
import { assertRateLimit } from "@/lib/rate-limit";
import { readJson } from "@/lib/request";
import { ziniPayVerifySchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  return withApiErrorHandling(async () => {
    assertRateLimit(request, {
      keyPrefix: "zinipay-verify",
      max: 30,
      windowMs: 60 * 1000
    });

    const input = ziniPayVerifySchema.parse(await readJson(request));
    const result = await finalizeZiniPayInvoice(input.invoiceId);

    return NextResponse.json({
      ok: true,
      ...formatResult(result)
    });
  });
}

function formatResult(result: Awaited<ReturnType<typeof finalizeZiniPayInvoice>>) {
  return {
    message: result.message,
    order: {
      id: result.order.id,
      customerName: result.order.customerName,
      email: result.order.email,
      phone: result.order.phone,
      paymentId: result.order.paymentId,
      linkId: result.order.linkId,
      assignedLink: result.order.assignedLink,
      createdAt: result.order.createdAt
    },
    email: result.email
  };
}
