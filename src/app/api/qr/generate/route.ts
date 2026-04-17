import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !(session.user as { isAdmin?: boolean }).isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { spendAmount } = await req.json();
  const amount = parseFloat(spendAmount);
  if (isNaN(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid spend amount" }, { status: 400 });
  }

  const sql = getDb();
  const code = uuidv4();
  const pointsValue = Math.floor(amount);
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const claimUrl = `${baseUrl}/claim/${code}`;

  await sql`
    INSERT INTO qr_codes (code, spend_amount, points_value, created_by)
    VALUES (${code}, ${amount}, ${pointsValue}, (SELECT id FROM users WHERE email = ${session.user.email!}))
  `;

  const qrDataUrl = await QRCode.toDataURL(claimUrl, {
    width: 800,
    margin: 2,
    color: { dark: "#111111", light: "#ffffff" },
    errorCorrectionLevel: "H",
  });

  return NextResponse.json({ code, claimUrl, qrDataUrl, pointsValue, spendAmount: amount });
}
