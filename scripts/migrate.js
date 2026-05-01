// Run with: node --env-file=.env.local scripts/migrate.js
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log('Creating tables...');

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name       TEXT NOT NULL,
      emoji      TEXT DEFAULT '',
      note       TEXT DEFAULT '',
      position   INTEGER DEFAULT 0,
      visible    BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS menu_items (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
      name        TEXT NOT NULL,
      description TEXT DEFAULT '',
      price       DECIMAL(10,2) NOT NULL DEFAULT 0,
      price_label TEXT DEFAULT '',
      subtitle    TEXT DEFAULT '',
      image_url   TEXT DEFAULT '',
      position    INTEGER DEFAULT 0,
      visible     BOOLEAN DEFAULT true,
      created_at  TIMESTAMPTZ DEFAULT now()
    )
  `;

  console.log('Tables ready.');

  // Check if already seeded
  const existing = await sql`SELECT COUNT(*) AS count FROM categories`;
  if (Number(existing[0].count) > 0) {
    console.log('Data already seeded — skipping seed step.');
    return;
  }

  console.log('Seeding categories and items...');

  const categories = [
    { name: 'Smash Burger',    emoji: '🍔', note: 'Smashed Angus beef with American cheese, lettuce, mayonnaise, gherkins and sauce of choice in a brioche bun', position: 0 },
    { name: 'Chicken Burger',  emoji: '🍗', note: 'Chicken with lettuce and mayonnaise in a brioche bun', position: 1 },
    { name: 'Mix Burger',      emoji: '🔀', note: 'American cheese, lettuce, mayonnaise, gherkins and sauce of choice', position: 2 },
    { name: 'Extra Toppings',  emoji: '🧀', note: '', position: 3 },
    { name: 'Make It A Meal',  emoji: '🍱', note: '', position: 4 },
    { name: 'Sides',           emoji: '🍟', note: '', position: 5 },
    { name: 'Fries',           emoji: '🍟', note: 'All loaded fries come with cheese sauce, Hannibal sauce and jalapeños', position: 6 },
    { name: 'Dips',            emoji: '🥫', note: '', position: 7 },
    { name: 'Drinks',          emoji: '🥤', note: '', position: 8 },
  ];

  const catIds = {};
  for (const cat of categories) {
    const [row] = await sql`
      INSERT INTO categories (name, emoji, note, position)
      VALUES (${cat.name}, ${cat.emoji}, ${cat.note}, ${cat.position})
      RETURNING id
    `;
    catIds[cat.name] = row.id;
    console.log(`  Category: ${cat.emoji} ${cat.name}`);
  }

  const items = [
    // Smash Burger
    { cat: 'Smash Burger', name: 'Single Smash', price: 5.00, price_label: '', position: 0, image_url: '/images/food/single-smash-burger.png', subtitle: 'Angus beef · American cheese · Brioche' },
    { cat: 'Smash Burger', name: 'Double Smash', price: 7.00, price_label: '', position: 1, image_url: '/images/food/smash-burger-hero.jpg',   subtitle: 'Two smashed patties · Double cheese' },
    { cat: 'Smash Burger', name: 'Triple Smash', price: 9.00, price_label: '', position: 2, image_url: '/images/food/triple-smash-burger-card.jpg', subtitle: 'Triple patty · For the brave' },

    // Chicken Burger
    { cat: 'Chicken Burger', name: 'Single', price: 5.00, price_label: '', position: 0, image_url: '/images/food/chicken-burger-card.jpg', subtitle: 'Crispy chicken · Lettuce · Mayo · Brioche' },
    { cat: 'Chicken Burger', name: 'Double', price: 7.00, price_label: '', position: 1, image_url: '', subtitle: '' },

    // Mix Burger
    { cat: 'Mix Burger', name: 'Single Patty', price: 7.00,  price_label: '', position: 0, image_url: '/images/food/mix-burger-card.jpg', subtitle: 'Beef & chicken · American cheese · Brioche' },
    { cat: 'Mix Burger', name: 'Double Patty', price: 9.00,  price_label: '', position: 1, image_url: '', subtitle: '' },
    { cat: 'Mix Burger', name: 'Triple Patty', price: 11.00, price_label: '', position: 2, image_url: '', subtitle: '' },

    // Extra Toppings
    { cat: 'Extra Toppings', name: 'Onions',        price: 1.00, price_label: '+£1.00', position: 0, image_url: '', subtitle: '' },
    { cat: 'Extra Toppings', name: 'Extra Chicken',  price: 2.00, price_label: '+£2.00', position: 1, image_url: '', subtitle: '' },
    { cat: 'Extra Toppings', name: 'Extra Beef',     price: 2.00, price_label: '+£2.00', position: 2, image_url: '', subtitle: '' },
    { cat: 'Extra Toppings', name: 'Cheese Bites',   price: 2.00, price_label: '+£2.00', position: 3, image_url: '', subtitle: '' },
    { cat: 'Extra Toppings', name: 'Jalapeños',      price: 0.00, price_label: 'Free',   position: 4, image_url: '', subtitle: '' },

    // Make It A Meal
    { cat: 'Make It A Meal', name: 'Skin On Fries & Drink',                   price: 2.50,  price_label: '+£2.50',  position: 0, image_url: '', subtitle: '' },
    { cat: 'Make It A Meal', name: 'Cheese Fries & Drink',                    price: 3.50,  price_label: '+£3.50',  position: 1, image_url: '', subtitle: '' },
    { cat: 'Make It A Meal', name: 'Beef Loaded Fries & Drink',               price: 5.00,  price_label: '+£5.00',  position: 2, image_url: '', subtitle: '' },
    { cat: 'Make It A Meal', name: 'Chicken Loaded Fries & Drink',            price: 5.00,  price_label: '+£5.00',  position: 3, image_url: '', subtitle: '' },
    { cat: 'Make It A Meal', name: 'Mix Loaded Fries & Drink',                price: 7.00,  price_label: '+£7.00',  position: 4, image_url: '', subtitle: '' },
    { cat: 'Make It A Meal', name: 'Strip Loaded Fries & Drink',              price: 8.50,  price_label: '+£8.50',  position: 5, image_url: '', subtitle: '' },
    { cat: 'Make It A Meal', name: 'Mix Loaded Fries with Strips & Drink',    price: 10.50, price_label: '+£10.50', position: 6, image_url: '', subtitle: '' },

    // Sides
    { cat: 'Sides', name: 'Chicken Popcorn',     price: 3.50, price_label: '', position: 0, image_url: '/images/food/sides-combo-card.jpg',     subtitle: 'Crispy bites · Perfect snack' },
    { cat: 'Sides', name: 'Cheese Bites (5pcs)', price: 3.50, price_label: '', position: 1, image_url: '',                                       subtitle: '' },
    { cat: 'Sides', name: 'Chicken Tenders (3pcs)', price: 5.00, price_label: '', position: 2, image_url: '/images/food/chicken-tenders-card.jpg', subtitle: '3 golden crispy tenders' },

    // Fries
    { cat: 'Fries', name: 'Skin on Fries',         price: 2.00,  price_label: '', position: 0, image_url: '',                                         subtitle: '' },
    { cat: 'Fries', name: 'Cheese Fries',           price: 3.50,  price_label: '', position: 1, image_url: '/images/food/cheese-fries.jpg',             subtitle: 'Skin on fries · Cheese sauce' },
    { cat: 'Fries', name: 'Chicken Loaded Fries',   price: 5.00,  price_label: '', position: 2, image_url: '/images/food/loaded-fries-card.jpg',        subtitle: 'Chicken · Cheese sauce · Jalapeños' },
    { cat: 'Fries', name: 'Beef Loaded Fries',      price: 5.00,  price_label: '', position: 3, image_url: '/images/food/beef-loaded-fries.png',         subtitle: 'Cheese sauce · Hannibal sauce · Jalapeños' },
    { cat: 'Fries', name: 'Mix Loaded Fries',       price: 7.00,  price_label: '', position: 4, image_url: '',                                           subtitle: '' },
    { cat: 'Fries', name: 'Strip Loaded Fries',     price: 8.50,  price_label: '', position: 5, image_url: '',                                           subtitle: '' },
    { cat: 'Fries', name: 'Mix Loaded Strip Fries', price: 10.50, price_label: '', position: 6, image_url: '',                                           subtitle: '' },

    // Dips
    { cat: 'Dips', name: 'Algerian · BBQ · Ketchup · Mayo · Hot Chilli · Sweet Chilli', price: 0.50, price_label: '£0.50 each', position: 0, image_url: '', subtitle: '' },

    // Drinks
    { cat: 'Drinks', name: 'Water',      price: 1.20, price_label: '', position: 0, image_url: '',                                  subtitle: '' },
    { cat: 'Drinks', name: 'Rio',        price: 1.50, price_label: '', position: 1, image_url: '',                                  subtitle: '' },
    { cat: 'Drinks', name: 'Tango Orange', price: 1.50, price_label: '', position: 2, image_url: '',                               subtitle: '' },
    { cat: 'Drinks', name: 'Mango',      price: 1.50, price_label: '', position: 3, image_url: '',                                  subtitle: '' },
    { cat: 'Drinks', name: 'Guava',      price: 1.50, price_label: '', position: 4, image_url: '',                                  subtitle: '' },
    { cat: 'Drinks', name: 'Irn Bru',    price: 1.50, price_label: '', position: 5, image_url: '',                                  subtitle: '' },
    { cat: 'Drinks', name: 'Pepsi',      price: 1.50, price_label: '', position: 6, image_url: '/images/food/soft-drink.png',       subtitle: 'Pepsi · Rio · Tango · Mango · Guava · Irn Bru' },
    { cat: 'Drinks', name: 'Pepsi Max',  price: 1.50, price_label: '', position: 7, image_url: '',                                  subtitle: '' },
  ];

  for (const item of items) {
    const catId = catIds[item.cat];
    await sql`
      INSERT INTO menu_items (category_id, name, price, price_label, subtitle, image_url, position)
      VALUES (${catId}, ${item.name}, ${item.price}, ${item.price_label}, ${item.subtitle}, ${item.image_url}, ${item.position})
    `;
    console.log(`  Item: ${item.name} (${item.price_label || '£' + item.price.toFixed(2)})`);
  }

  console.log('\nMigration complete!');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
