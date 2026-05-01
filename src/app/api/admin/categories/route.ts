import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, emoji = '', note = '' } = body;

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const [category] = await sql`
      INSERT INTO categories (name, emoji, note)
      VALUES (${name}, ${emoji}, ${note})
      RETURNING id, name, emoji, note, position, visible
    `;

    return NextResponse.json({ ...category, items: [] }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/categories error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
