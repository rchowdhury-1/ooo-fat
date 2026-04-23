import { neon } from "@neondatabase/serverless";

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export async function initDb() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      "emailVerified" TIMESTAMPTZ,
      image TEXT,
      stamps INTEGER DEFAULT 0,
      total_spent NUMERIC(10,2) DEFAULT 0,
      is_admin BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMPTZ`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS image TEXT`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS stamps INTEGER DEFAULT 0`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS total_spent NUMERIC(10,2) DEFAULT 0`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false`;

  await sql`
    CREATE TABLE IF NOT EXISTS qr_codes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      code TEXT UNIQUE NOT NULL,
      spend_amount NUMERIC(10,2) NOT NULL,
      includes_burger BOOLEAN DEFAULT false,
      stamp_value INTEGER DEFAULT 0,
      claimed_by UUID REFERENCES users(id),
      claimed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      created_by UUID REFERENCES users(id)
    )
  `;

  await sql`ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS includes_burger BOOLEAN DEFAULT false`;
  await sql`ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS stamp_value INTEGER DEFAULT 0`;

  await sql`
    CREATE TABLE IF NOT EXISTS stamps_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      qr_code_id UUID REFERENCES qr_codes(id) ON DELETE SET NULL,
      stamps INTEGER NOT NULL,
      action TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Backfill column for existing installations created before this migration
  await sql`ALTER TABLE stamps_history ADD COLUMN IF NOT EXISTS qr_code_id UUID REFERENCES qr_codes(id) ON DELETE SET NULL`;

  await sql`
    CREATE TABLE IF NOT EXISTS rewards (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      discount_code TEXT UNIQUE NOT NULL,
      stamps_used INTEGER NOT NULL DEFAULT 8,
      redeemed BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE rewards ADD COLUMN IF NOT EXISTS stamps_used INTEGER DEFAULT 8`;

  await sql`
    CREATE TABLE IF NOT EXISTS accounts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "userId" UUID REFERENCES users(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      "providerAccountId" TEXT NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at BIGINT,
      token_type TEXT,
      scope TEXT,
      id_token TEXT,
      session_state TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      "sessionToken" TEXT UNIQUE NOT NULL,
      "userId" UUID REFERENCES users(id) ON DELETE CASCADE,
      expires TIMESTAMPTZ NOT NULL
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS verification_tokens (
      identifier TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires TIMESTAMPTZ NOT NULL,
      PRIMARY KEY (identifier, token)
    )
  `;
}
