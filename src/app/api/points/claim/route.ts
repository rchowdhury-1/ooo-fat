import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

const STAMPS_PER_REWARD = 8;

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json({ error: "Email and code required" }, { status: 400 });
  }

  const emailLower = email.toLowerCase().trim();
  const sql = getDb();

  const qrRows = await sql`SELECT * FROM qr_codes WHERE code = ${code}`;
  if (qrRows.length === 0) {
    return NextResponse.json({ error: "Invalid QR code" }, { status: 404 });
  }
  const qr = qrRows[0];

  if (qr.claimed_by) {
    return NextResponse.json({ error: "This QR code has already been claimed" }, { status: 409 });
  }

  // Upsert user
  await sql`
    INSERT INTO users (email) VALUES (${emailLower})
    ON CONFLICT (email) DO NOTHING
  `;

  const userRows = await sql`SELECT * FROM users WHERE email = ${emailLower}`;
  const user = userRows[0];

  // Atomic claim — only succeeds if still unclaimed
  await sql`
    UPDATE qr_codes
    SET claimed_by = ${user.id}, claimed_at = NOW()
    WHERE code = ${code} AND claimed_by IS NULL
  `;

  const verifyRows = await sql`SELECT claimed_by FROM qr_codes WHERE code = ${code}`;
  if (String(verifyRows[0].claimed_by) !== String(user.id)) {
    return NextResponse.json({ error: "This QR code was just claimed by someone else" }, { status: 409 });
  }

  // Award stamp if order included a burger
  const stampEarned = qr.includes_burger ? 1 : 0;
  const prevStamps = user.stamps || 0;
  const newStamps = prevStamps + stampEarned;
  const newTotalSpent = parseFloat(String(user.total_spent || 0)) + parseFloat(String(qr.spend_amount));

  await sql`
    UPDATE users
    SET stamps = ${newStamps}, total_spent = ${newTotalSpent}
    WHERE id = ${user.id}
  `;

  // Log to stamps_history
  const description = qr.includes_burger
    ? `Burger stamp earned — £${parseFloat(String(qr.spend_amount)).toFixed(2)} order`
    : `Order recorded — £${parseFloat(String(qr.spend_amount)).toFixed(2)} (no burger)`;

  await sql`
    INSERT INTO stamps_history (user_id, qr_code_id, stamps, action, description)
    VALUES (${user.id}, ${qr.id}, ${stampEarned}, 'earn', ${description})
  `;

  // Auto-generate free burger reward when a new multiple of 8 is crossed
  const prevCycles = Math.floor(prevStamps / STAMPS_PER_REWARD);
  const newCycles = Math.floor(newStamps / STAMPS_PER_REWARD);
  let freeBurgerCode: string | null = null;

  if (newCycles > prevCycles && newStamps > 0) {
    freeBurgerCode = `FATFREE-${uuidv4().slice(0, 8).toUpperCase()}`;
    await sql`
      INSERT INTO rewards (user_id, discount_code, stamps_used)
      VALUES (${user.id}, ${freeBurgerCode}, ${STAMPS_PER_REWARD})
    `;
    await sql`
      INSERT INTO stamps_history (user_id, stamps, action, description)
      VALUES (${user.id}, ${-STAMPS_PER_REWARD}, 'reward', ${"Free Single Patty earned — code: " + freeBurgerCode})
    `;
  }

  return NextResponse.json({
    success: true,
    stampEarned: stampEarned > 0,
    newStamps,
    stampsInCycle: newStamps % STAMPS_PER_REWARD,
    spendAmount: qr.spend_amount,
    freeBurgerCode,
  });
}
