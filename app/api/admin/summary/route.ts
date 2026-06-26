import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { withApiErrorHandling } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  return withApiErrorHandling(async () => {
    await requireAdmin(request);

    const [availableLinks, soldLinks, totalOrders] = await Promise.all([
      prisma.link.count({ where: { status: "available" } }),
      prisma.link.count({ where: { status: "sold" } }),
      prisma.order.count()
    ]);

    return NextResponse.json({
      ok: true,
      summary: {
        availableLinks,
        soldLinks,
        totalOrders
      }
    });
  });
}
