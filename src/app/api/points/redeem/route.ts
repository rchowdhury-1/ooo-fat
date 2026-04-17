import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const sql = getDb();
  const userRows = await sql`SELECT * FROM users WHERE email = ${session.user.email}`;
  if (userRows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const user = userRows[0];

  if ((user.points || 0) < 50) {
    return NextResponse.json({ error: "Not enough points (need 50)" }, { status: 400 });
  }

  const discountCode = `FAT-${uuidv4().slice(0, 8).toUpperCase()}`;
  const newPoints = user.points - 50;

  await sql`UPDATE users SET points = ${newPoints} WHERE id = ${user.id}`;

  await sql`
    INSERT INTO rewards (user_id, discount_code, points_used)
    VALUES (${user.id}, ${discountCode}, 50)
  `;

  await sql`
    INSERT INTO points_history (user_id, points, action, description)
    VALUES (${user.id}, ${-50}, 'redeem', ${"Redeemed 50 points for £5 discount — code: " + discountCode})
  `;

  return NextResponse.json({ success: true, discountCode, newPoints });
}
