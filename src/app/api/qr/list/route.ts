import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user || !(session.user as { isAdmin?: boolean }).isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sql = getDb();
  const codes = await sql`
    SELECT
      q.id, q.code, q.spend_amount, q.points_value,
      q.claimed_at, q.created_at,
      u.email AS claimed_by_email
    FROM qr_codes q
    LEFT JOIN users u ON q.claimed_by = u.id
    ORDER BY q.created_at DESC
    LIMIT 200
  `;

  return NextResponse.json(codes);
}
