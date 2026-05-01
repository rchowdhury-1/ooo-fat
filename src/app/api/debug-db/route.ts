import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL ?? 'NOT SET';
  const host = dbUrl !== 'NOT SET' ? new URL(dbUrl).host : 'N/A';

  const rows = await sql`
    SELECT name, image_url FROM menu_items WHERE image_url != '' ORDER BY created_at
  `;

  return NextResponse.json({
    db_host: host,
    items_with_images: rows,
  }, { headers: { 'Cache-Control': 'no-store' } });
}
