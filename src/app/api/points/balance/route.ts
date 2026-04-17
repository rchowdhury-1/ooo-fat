import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const sql = getDb();
  const userRows = await sql`SELECT * FROM users WHERE email = ${session.user.email}`;
  if (userRows.length === 0) {
    return NextResponse.json({ points: 0, total_spent: 0, history: [], rewards: [] });
  }
  const user = userRows[0];

  const history = await sql`
    SELECT points, action, description, created_at
    FROM points_history
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
    LIMIT 50
  `;

  const rewards = await sql`
    SELECT discount_code, points_used, redeemed, created_at
    FROM rewards
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
  `;

  return NextResponse.json({
    points: user.points || 0,
    total_spent: user.total_spent || 0,
    history,
    rewards,
  });
}
