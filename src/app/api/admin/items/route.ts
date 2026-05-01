import { NextRequest, NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      category_id,
      name,
      price = 0,
      description = '',
      price_label = '',
      subtitle = '',
      image_url = '',
    } = body;

    if (!category_id || !name) {
      return NextResponse.json({ error: 'category_id and name are required' }, { status: 400 });
    }

    const [item] = await sql`
      INSERT INTO menu_items (category_id, name, price, description, price_label, subtitle, image_url)
      VALUES (${category_id}, ${name}, ${price}, ${description}, ${price_label}, ${subtitle}, ${image_url})
      RETURNING id, category_id, name, description, price::float, price_label, subtitle, image_url, position, visible
    `;

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/items error:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
