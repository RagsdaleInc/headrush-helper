# Headrush Community Tool (Next.js)

This app is the UI foundation for your Headrush community platform.

## Current Features

- Browse amps, cabs, and effects from `../DataFiles/headrush_library.json`
- Google sign-in via NextAuth
- Role model in place (`FREE`, `PAID`, `ADMIN`)
- Role-protected admin route (`/admin`)
- Prisma schema + seed script for importing model data to Postgres

## Tech Stack

- Next.js (App Router, TypeScript)
- NextAuth (`next-auth`) + Google provider
- Prisma + PostgreSQL
- Tailwind CSS

## Setup

1. Copy env template:

```bash
cp .env.example .env.local
```

2. Fill in:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

3. Generate Prisma client:

```bash
npm run db:generate
```

4. Run database migrations:

```bash
npm run db:migrate
```

5. Optional: seed model data into DB:

```bash
npm run db:seed
```

6. Promote an existing user to ADMIN (after first sign-in):

```bash
npm run user:make-admin -- user@example.com
```

7. Start dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

- `/` - Landing + stats
- `/models` - Model browser from `DataFiles/headrush_library.json`
- `/login` - Google sign-in
- `/dashboard` - Authenticated user area
- `/admin` - ADMIN-only page

## Notes

- Current browser UI reads from JSON directly for fast iteration.
- Prisma models are ready for a switch to DB-backed browsing when you want.
