import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminToken";

export async function GET(req: NextRequest) {
  const valid = await verifyAdminRequest(req);
  return NextResponse.json({ valid });
}
