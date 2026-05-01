import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Fresh connection per request to avoid stale pooled query plans
    const sql = neon(process.env.DATABASE_URL!);

    const categories = await sql`
      SELECT id, name, emoji, note, position
      FROM categories
      WHERE visible = true
      ORDER BY position, created_at
    `;

    const items = await sql`
      SELECT id, category_id, name, description, price::float, price_label,
             subtitle, image_url, position
      FROM menu_items
      WHERE visible = true
      ORDER BY position, created_at
    `;

    type Row = Record<string, unknown>;
    const result = (categories as Row[]).map((cat) => ({
      ...cat,
      items: (items as Row[]).filter((item) => item.category_id === cat.id),
    }));

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('GET /api/menu error:', error);
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}
