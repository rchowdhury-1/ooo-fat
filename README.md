# Ooo..FAT! — Restaurant Website

Smash burger drive-thru website for Ooo..FAT!, Birmingham.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL via [Neon](https://neon.tech)
- **Auth**: NextAuth.js v5 (magic link / email)
- **Email**: [Resend](https://resend.com)
- **QR Codes**: `qrcode` npm package
- **Deployment**: Vercel

---

## Local Setup

### 1. Install dependencies

```bash
cd ~/Desktop/Coding/ooo-fat
npm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | [neon.tech](https://neon.tech) — Create project → Connection string |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` locally |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |
| `ADMIN_EMAIL` | `razwanulchowdhury@gmail.com` |

### 3. Initialise the database

After starting the dev server, visit once to create all tables:

```
http://localhost:3000/api/init
```

### 4. Run locally

```bash
npm run dev
```

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, about, map, loyalty teaser |
| `/menu` | Full menu with sticky category nav |
| `/loyalty` | Loyalty dashboard — sign in, balance, history, redeem |
| `/claim/[code]` | Mobile QR claim page (scanned from receipt) |
| `/admin` | Admin dashboard (admin email only) |

---

## Admin Dashboard (`/admin`)

Only the `ADMIN_EMAIL` account can access this.

- **Stats** — customers, points issued, rewards redeemed, QR stats
- **Generate QR** — enter spend amount → download high-res PNG for receipt
- **Customers** — searchable table with points and spend
- **QR Codes** — all codes with claimed/unclaimed status
- **Adjust Points** — add or remove points with reason

---

## Loyalty System

1. Customer orders at drive-thru
2. Staff generates QR code for spend amount (admin panel)
3. QR printed on receipt
4. Customer scans QR on phone → enters email → points added instantly
5. First-time customers auto-registered (no prior signup needed)
6. 50 points = £5 discount code, shown in loyalty page

**Rate:** £1 spent = 1 point · 50 points = £5 reward

---

## Deployment (Vercel)

```bash
npm i -g vercel
vercel

# Add env vars
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL      # set to your production URL
vercel env add RESEND_API_KEY
vercel env add ADMIN_EMAIL
```

Then visit `https://yourdomain.com/api/init` once to create tables.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                      Homepage
│   ├── layout.tsx                    Root layout + session provider
│   ├── globals.css                   Brand styles + Google Fonts
│   ├── menu/page.tsx                 Menu with sticky category nav
│   ├── loyalty/page.tsx              Loyalty dashboard
│   ├── claim/[code]/page.tsx         Receipt QR claim flow
│   ├── admin/page.tsx                Admin dashboard
│   └── api/
│       ├── auth/[...nextauth]/       NextAuth handlers
│       ├── init/                     DB table creation
│       ├── qr/generate/              Generate QR code (admin)
│       ├── qr/list/                  List QR codes (admin)
│       ├── points/claim/             Claim points via QR
│       ├── points/balance/           Get user balance + history
│       ├── points/redeem/            Redeem points for discount
│       ├── admin/stats/              Dashboard stats
│       ├── admin/customers/          Customer list
│       └── admin/adjust-points/      Manual points adjustment
├── components/
│   └── SessionProvider.tsx
├── lib/
│   ├── auth.ts                       NextAuth + Resend config
│   └── db.ts                         Neon SQL client + schema
├── middleware.ts                     Admin route guard
└── types/next-auth.d.ts              Session type extensions
```
