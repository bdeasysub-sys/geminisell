import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { withApiErrorHandling } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";
import { getSearchParams } from "@/lib/request";
import { ordersQuerySchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  return withApiErrorHandling(async () => {
    await requireAdmin(request);
    const query = ordersQuerySchema.parse(getSearchParams(request));
    const where: Prisma.OrderWhereInput = query.search
      ? {
          OR: [
            { customerName: { contains: query.search } },
            { email: { contains: query.search } },
            { phone: { contains: query.search } },
            { paymentId: { contains: query.search } },
            { assignedLink: { contains: query.search } }
          ]
        }
      : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit
      }),
      prisma.order.count({ where })
    ]);

    return NextResponse.json({
      ok: true,
      orders,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit)
      }
    });
  });
}
