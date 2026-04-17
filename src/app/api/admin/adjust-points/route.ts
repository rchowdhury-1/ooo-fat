import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !(session.user as { isAdmin?: boolean }).isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, points, reason } = await req.json();
  if (!email || typeof points !== "number" || !reason) {
    return NextResponse.json({ error: "email, points (number), and reason required" }, { status: 400 });
  }

  const sql = getDb();
  const userRows = await sql`SELECT * FROM users WHERE email = ${email.toLowerCase().trim()}`;
  if (userRows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const user = userRows[0];
  const newPoints = Math.max(0, (user.points || 0) + points);

  await sql`UPDATE users SET points = ${newPoints} WHERE id = ${user.id}`;

  await sql`
    INSERT INTO points_history (user_id, points, action, description)
    VALUES (${user.id}, ${points}, 'admin_adjust', ${reason})
  `;

  return NextResponse.json({ success: true, newPoints, email });
}
