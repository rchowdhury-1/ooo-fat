import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { Pool } from "@neondatabase/serverless";
import PostgresAdapter from "@auth/pg-adapter";

// Pool with fallback so it doesn't crash at build time (no real DB needed during build)
const pool = new Pool({ connectionString: process.env.DATABASE_URL || "postgres://placeholder" });

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PostgresAdapter(pool),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "Ooo..FAT! <noreply@ooo-fat.com>",
      name: "Email",
    }),
  ],
  pages: {
    signIn: "/loyalty",
    verifyRequest: "/loyalty?verify=true",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const { neon } = await import("@neondatabase/serverless");
        const sql = neon(process.env.DATABASE_URL!);
        const rows = await sql`SELECT is_admin FROM users WHERE email = ${session.user.email}`;
        (session.user as { id: string; isAdmin?: boolean }).isAdmin = rows[0]?.is_admin ?? false;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (user.email === process.env.ADMIN_EMAIL) {
        const { neon } = await import("@neondatabase/serverless");
        const sql = neon(process.env.DATABASE_URL!);
        await sql`UPDATE users SET is_admin = true WHERE email = ${user.email}`;
      }
    },
  },
});
