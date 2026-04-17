import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !(session.user as { isAdmin?: boolean }).isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sql = getDb();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  const customers = search
    ? await sql`
        SELECT id, email, name, stamps, total_spent, created_at
        FROM users
        WHERE email ILIKE ${"%" + search + "%"} AND is_admin = false
        ORDER BY created_at DESC
        LIMIT 100
      `
    : await sql`
        SELECT id, email, name, stamps, total_spent, created_at
        FROM users
        WHERE is_admin = false
        ORDER BY created_at DESC
        LIMIT 100
      `;

  return NextResponse.json(customers);
}
