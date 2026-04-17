import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user || !(session.user as { isAdmin?: boolean }).isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sql = getDb();
  const [totalCustomers] = await sql`SELECT COUNT(*) AS count FROM users WHERE is_admin = false`;
  const [totalStamps] = await sql`SELECT COALESCE(SUM(stamps), 0) AS total FROM users WHERE is_admin = false`;
  const [totalRedeemed] = await sql`SELECT COUNT(*) AS count FROM rewards WHERE redeemed = true`;
  const [totalQr] = await sql`SELECT COUNT(*) AS count FROM qr_codes`;
  const [claimedQr] = await sql`SELECT COUNT(*) AS count FROM qr_codes WHERE claimed_by IS NOT NULL`;
  const [burgerQr] = await sql`SELECT COUNT(*) AS count FROM qr_codes WHERE includes_burger = true AND claimed_by IS NOT NULL`;

  return NextResponse.json({
    totalCustomers: Number(totalCustomers.count),
    totalStampsIssued: Number(totalStamps.total),
    totalRewardsRedeemed: Number(totalRedeemed.count),
    totalQrCodes: Number(totalQr.count),
    claimedQrCodes: Number(claimedQr.count),
    burgerStampsAwarded: Number(burgerQr.count),
  });
}
