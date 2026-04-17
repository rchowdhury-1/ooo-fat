import { NextResponse } from "next/server";
import { initDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDb();
    return NextResponse.json({ ok: true, message: "Database initialised" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
