import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { withApiErrorHandling } from "@/lib/api-errors";

export async function GET(request: NextRequest) {
  return withApiErrorHandling(async () => {
    const admin = await requireAdmin(request);
    return NextResponse.json({ ok: true, admin });
  });
}
