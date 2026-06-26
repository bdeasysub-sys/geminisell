import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { ApiError, withApiErrorHandling } from "@/lib/api-errors";
import { parseLinksCsv } from "@/lib/csv";
import { prisma } from "@/lib/prisma";
import { readJson } from "@/lib/request";
import { bulkUploadSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  return withApiErrorHandling(async () => {
    await requireAdmin(request);
    const input = bulkUploadSchema.parse(await readJson(request));
    const links = parseLinksCsv(input.csv);

    if (links.length === 0) {
      throw new ApiError(422, "validation_error", "CSV must include at least one link.");
    }

    const result = await prisma.link.createMany({
      data: links.map((link) => ({ link })),
      skipDuplicates: true
    });

    return NextResponse.json({
      ok: true,
      uploaded: result.count,
      skipped: links.length - result.count
    });
  });
}
