import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { assertFound, withApiErrorHandling } from "@/lib/api-errors";
import { sendSubscriptionEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { idParamSchema } from "@/lib/validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: NextRequest, context: RouteContext) {
  return withApiErrorHandling(async () => {
    await requireAdmin(request);
    const { id } = idParamSchema.parse(await context.params);
    const order = assertFound(
      await prisma.order.findUnique({ where: { id } }),
      "Order not found."
    );
    const email = await sendSubscriptionEmail({
      customerName: order.customerName,
      email: order.email,
      assignedLink: order.assignedLink
    });

    return NextResponse.json({
      ok: true,
      email
    });
  });
}
