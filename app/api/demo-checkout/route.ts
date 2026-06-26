import { NextRequest, NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-errors";
import { assignFirstAvailableLink } from "@/lib/link-assignment";
import { assertRateLimit } from "@/lib/rate-limit";
import { readJson } from "@/lib/request";
import { demoCheckoutSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  return withApiErrorHandling(async () => {
    assertRateLimit(request, {
      keyPrefix: "demo-checkout",
      max: 30,
      windowMs: 60 * 1000
    });

    const input = demoCheckoutSchema.parse(await readJson(request));
    const assignment = await assignFirstAvailableLink({
      ...input,
      paymentId: createDemoPaymentId()
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Demo order created successfully.",
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
        email: {
          sent: false,
          skipped: true,
          reason: "Demo checkout returns the assigned link directly and does not send email."
        }
      },
      { status: 201 }
    );
  });
}

function createDemoPaymentId() {
  return `DEMO-${Date.now()}-${crypto.randomUUID()}`;
}
