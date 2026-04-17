import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !(session.user as { isAdmin?: boolean }).isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, stamps, reason } = await req.json();
  if (!email || typeof stamps !== "number" || !reason) {
    return NextResponse.json({ error: "email, stamps (number), and reason required" }, { status: 400 });
  }

  const sql = getDb();
  const userRows = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase().trim()}`;
  if (userRows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const user = userRows[0];
  const newStamps = Math.max(0, (user.stamps || 0) + stamps);

  await sql`UPDATE users SET stamps = ${newStamps} WHERE id = ${user.id}`;

  await sql`
    INSERT INTO stamps_history (user_id, stamps, action, description)
    VALUES (${user.id}, ${stamps}, 'admin_adjust', ${reason})
  `;

  return NextResponse.json({ success: true, newStamps, email });
}
