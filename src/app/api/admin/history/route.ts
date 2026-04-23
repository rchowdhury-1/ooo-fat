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
      u.email
    FROM stamps_history sh
    JOIN users u ON sh.user_id = u.id
    ORDER BY sh.created_at DESC
    LIMIT 500
  `;

  return NextResponse.json(history);
}
