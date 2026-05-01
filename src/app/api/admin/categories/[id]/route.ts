import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const n = body.name ?? null;
    const e = body.emoji ?? null;
    const nt = body.note ?? null;
    const v = body.visible ?? null;

    const [category] = await sql`
      UPDATE categories
      SET
        name    = COALESCE(${n},  name),
        emoji   = COALESCE(${e},  emoji),
        note    = COALESCE(${nt}, note),
        visible = COALESCE(${v},  visible)
      WHERE id = ${params.id}
      RETURNING id, name, emoji, note, position, visible
    `;

    if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(category);
  } catch (error) {
    console.error('PUT /api/admin/categories/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}
