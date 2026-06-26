import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { withApiErrorHandling } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";
import { getSearchParams, readJson } from "@/lib/request";
import { addLinkSchema, linksQuerySchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  return withApiErrorHandling(async () => {
    await requireAdmin(request);

    const query = linksQuerySchema.parse(getSearchParams(request));
    const where: Prisma.LinkWhereInput = {
      ...(query.status === "all" ? {} : { status: query.status }),
      ...(query.q
        ? {
            OR: [
              { link: { contains: query.q } },
              { assignedTo: { contains: query.q } },
              { paymentId: { contains: query.q } }
            ]
          }
        : {})
    };

    const [links, total] = await Promise.all([
      prisma.link.findMany({
        where,
        orderBy: { id: "asc" },
        skip: (query.page - 1) * query.limit,
        take: query.limit
      }),
      prisma.link.count({ where })
    ]);

    return NextResponse.json({
      ok: true,
      links,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages: Math.ceil(total / query.limit)
      }
    });
  });
}

export async function POST(request: NextRequest) {
  return withApiErrorHandling(async () => {
    await requireAdmin(request);
    const input = addLinkSchema.parse(await readJson(request));
    const link = await prisma.link.create({
      data: {
        link: input.link
      }
    });

    return NextResponse.json({ ok: true, link }, { status: 201 });
  });
}
