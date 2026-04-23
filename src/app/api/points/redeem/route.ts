import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

const STAMPS_PER_REWARD = 8;

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

  if ((user.stamps || 0) < STAMPS_PER_REWARD) {
    return NextResponse.json(
      { error: `Not enough stamps (need ${STAMPS_PER_REWARD})` },
      { status: 400 }
    );
  }

  const discountCode = `FATFREE-${uuidv4().slice(0, 8).toUpperCase()}`;
  const newStamps = (user.stamps || 0) - STAMPS_PER_REWARD;

  await sql`UPDATE users SET stamps = ${newStamps} WHERE id = ${user.id}`;

  await sql`
    INSERT INTO rewards (user_id, discount_code, stamps_used)
    VALUES (${user.id}, ${discountCode}, ${STAMPS_PER_REWARD})
  `;

  await sql`
    INSERT INTO stamps_history (user_id, stamps, action, description)
    VALUES (${user.id}, ${-STAMPS_PER_REWARD}, 'redeem', ${"Redeemed " + STAMPS_PER_REWARD + " stamps for free burger — code: " + discountCode})
  `;

  return NextResponse.json({ success: true, discountCode, newStamps });
}
