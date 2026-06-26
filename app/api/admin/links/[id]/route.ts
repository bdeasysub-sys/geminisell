import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { ApiError, assertFound, withApiErrorHandling } from "@/lib/api-errors";
import { prisma } from "@/lib/prisma";
import { idParamSchema } from "@/lib/validation";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(request: NextRequest, context: RouteContext) {
  return withApiErrorHandling(async () => {
    await requireAdmin(request);
    const { id } = idParamSchema.parse(await context.params);
    const link = assertFound(
      await prisma.link.findUnique({ where: { id } }),
      "Link not found."
    );

    if (link.status === "sold") {
      throw new ApiError(409, "conflict", "Sold links cannot be deleted because they are attached to orders.");
    }

    await prisma.link.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  });
}
