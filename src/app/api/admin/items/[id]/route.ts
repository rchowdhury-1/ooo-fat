import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const n = body.name ?? null;
    const p = body.price ?? null;
    const d = body.description ?? null;
    const pl = body.price_label ?? null;
    const v = body.visible ?? null;
    const s = body.subtitle ?? null;
    const iu = body.image_url ?? null;

    const [item] = await sql`
      UPDATE menu_items
      SET
        name        = COALESCE(${n},  name),
        price       = COALESCE(${p},  price),
        description = COALESCE(${d},  description),
        price_label = COALESCE(${pl}, price_label),
        visible     = COALESCE(${v},  visible),
        subtitle    = COALESCE(${s},  subtitle),
        image_url   = COALESCE(${iu}, image_url)
      WHERE id = ${params.id}
      RETURNING id, category_id, name, description, price::float, price_label, subtitle, image_url, position, visible
    `;

    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    console.error('PUT /api/admin/items/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await sql`DELETE FROM menu_items WHERE id = ${params.id}`;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/admin/items/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
