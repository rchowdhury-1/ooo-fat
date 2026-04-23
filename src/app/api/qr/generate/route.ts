import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminToken";
import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

export async function POST(req: NextRequest) {
  if (!(await verifyAdminRequest(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { spendAmount, includesBurger } = await req.json();
  const amount = parseFloat(spendAmount);
  if (isNaN(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid spend amount" }, { status: 400 });
  }

  const hasBurger = Boolean(includesBurger);
  const stampValue = hasBurger ? 1 : 0;

  const sql = getDb();
  const code = uuidv4();
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const claimUrl = `${baseUrl}/claim/${code}`;

  await sql`
    INSERT INTO qr_codes (code, spend_amount, includes_burger, stamp_value)
    VALUES (${code}, ${amount}, ${hasBurger}, ${stampValue})
  `;

  const qrDataUrl = await QRCode.toDataURL(claimUrl, {
    width: 800,
    margin: 2,
    color: { dark: "#111111", light: "#ffffff" },
    errorCorrectionLevel: "H",
  });

  return NextResponse.json({
    code,
    claimUrl,
    qrDataUrl,
    stampValue,
    includesBurger: hasBurger,
    spendAmount: amount,
  });
}
