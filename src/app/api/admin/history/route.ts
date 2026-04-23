import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminToken";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!(await verifyAdminRequest(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sql = getDb();
  const history = await sql`
    SELECT
      sh.id,
      sh.stamps,
      sh.action,
      sh.description,
      sh.created_at,
      sh.qr_code_id,
      u.email,
      q.code      AS qr_code,
      q.spend_amount AS qr_spend
    FROM stamps_history sh
    JOIN users u ON sh.user_id = u.id
    LEFT JOIN qr_codes q ON sh.qr_code_id = q.id
    ORDER BY sh.created_at DESC
    LIMIT 500
  `;

  return NextResponse.json(history);
}
