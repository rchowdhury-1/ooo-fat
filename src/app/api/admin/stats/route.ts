import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/adminToken";
import { getDb } from "@/lib/db";

const ZERO_STATS = {
  totalCustomers: 0,
  totalStampsIssued: 0,
  totalRewardsRedeemed: 0,
  totalQrCodes: 0,
  claimedQrCodes: 0,
  burgerStampsAwarded: 0,
};

export async function GET(req: NextRequest) {
  try {
    if (!(await verifyAdminRequest(req))) {
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
  } catch (err) {
    console.error("[/api/admin/stats]", err);
    // Return zero defaults so the dashboard always renders — DB may not be initialised yet
    return NextResponse.json(ZERO_STATS);
  }
}
