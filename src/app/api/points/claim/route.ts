import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

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

  await sql`
    INSERT INTO users (email) VALUES (${emailLower})
    ON CONFLICT (email) DO NOTHING
  `;

  const userRows = await sql`SELECT * FROM users WHERE email = ${emailLower}`;
  const user = userRows[0];

  await sql`
    UPDATE qr_codes
    SET claimed_by = ${user.id}, claimed_at = NOW()
    WHERE code = ${code} AND claimed_by IS NULL
  `;

  const verifyRows = await sql`SELECT claimed_by FROM qr_codes WHERE code = ${code}`;
  if (verifyRows[0].claimed_by !== user.id) {
    return NextResponse.json({ error: "This QR code was just claimed by someone else" }, { status: 409 });
  }

  const newPoints = (user.points || 0) + qr.points_value;
  const newTotalSpent = parseFloat(user.total_spent || 0) + parseFloat(qr.spend_amount);

  await sql`
    UPDATE users
    SET points = ${newPoints}, total_spent = ${newTotalSpent}
    WHERE id = ${user.id}
  `;

  await sql`
    INSERT INTO points_history (user_id, points, action, description)
    VALUES (${user.id}, ${qr.points_value}, 'earn', ${"QR claim — £" + qr.spend_amount + " spend"})
  `;

  return NextResponse.json({
    success: true,
    pointsEarned: qr.points_value,
    newTotal: newPoints,
    spendAmount: qr.spend_amount,
  });
}
