import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminToken";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!(await verifyAdminRequest(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sql = getDb();
  const rewards = await sql`
    SELECT
      r.id,
      r.discount_code,
      r.stamps_used,
      r.redeemed,
      r.created_at,
      u.email
    FROM rewards r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
    LIMIT 500
  `;

  return NextResponse.json(rewards);
}

export async function PATCH(req: NextRequest) {
  if (!(await verifyAdminRequest(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, redeemed } = await req.json();
  if (!id || typeof redeemed !== "boolean") {
    return NextResponse.json({ error: "id and redeemed (boolean) required" }, { status: 400 });
  }

  const sql = getDb();
  await sql`UPDATE rewards SET redeemed = ${redeemed} WHERE id = ${id}`;

  return NextResponse.json({ success: true });
}
