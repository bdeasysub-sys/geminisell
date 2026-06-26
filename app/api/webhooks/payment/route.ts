import { NextRequest, NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-errors";
import { assignFirstAvailableLink } from "@/lib/link-assignment";
import { assertRateLimit } from "@/lib/rate-limit";
import { readJson, requireWebhookSecret } from "@/lib/request";
import { sendSubscriptionEmail } from "@/lib/email";
import { getWebhookSecret } from "@/lib/env";
import { parsePaymentWebhookPayload } from "@/lib/validation";

export async function POST(request: NextRequest) {
  return withApiErrorHandling(async () => {
    assertRateLimit(request, {
      keyPrefix: "payment-webhook",
      max: 120,
      windowMs: 60 * 1000
    });
    requireWebhookSecret(request, getWebhookSecret());

    const input = parsePaymentWebhookPayload(await readJson(request));
    const assignment = await assignFirstAvailableLink(input);
    const email = await sendSubscriptionEmail({
      customerName: input.customerName,
      email: input.email,
      assignedLink: assignment.assignedLink
    });

    return NextResponse.json({
      ok: true,
      message: assignment.alreadyAssigned
        ? "Payment was already assigned."
        : "Link assigned successfully.",
      order: {
        id: assignment.order.id,
        customerName: assignment.order.customerName,
        email: assignment.order.email,
        phone: assignment.order.phone,
        paymentId: assignment.order.paymentId,
        linkId: assignment.order.linkId,
        assignedLink: assignment.order.assignedLink,
        createdAt: assignment.order.createdAt
      },
      email
    });
  });
}
