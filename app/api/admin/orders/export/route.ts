import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { toCsv } from "@/lib/csv";
import { withApiErrorHandling } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  return withApiErrorHandling(async () => {
    await requireAdmin(request);

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" }
    });
    const csv = toCsv(
      orders.map((order) => ({
        id: order.id,
        customer_name: order.customerName,
        email: order.email,
        phone: order.phone,
        payment_id: order.paymentId,
        link_id: order.linkId,
        assigned_link: order.assignedLink,
        created_at: order.createdAt
      }))
    );

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="easysub-orders-${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`
      }
    });
  });
}
