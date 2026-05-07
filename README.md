# FX Journal

A Vercel-ready forex trading journal built with Next.js and Neon Postgres.

## Features

- Email/password signup and signin
- Per-user trade journal
- Market, lot size, account currency, planned risk, target reward, actual P/L, setup, notes, and lessons
- Total P/L, win rate, current win streak, best win streak, and average R multiple
- Neon SQL migration included in `migrations/001_init.sql`

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. For quick local testing, start the app without any database setup:

```bash
npm run dev
```

When `DATABASE_URL` is missing, the app stores local test users and trades in
`.data/fxjournal.json`.

3. To test against Neon locally, create `.env.local`:

```bash
DATABASE_URL="postgres://user:password@host.neon.tech/dbname?sslmode=require"
AUTH_SECRET="replace-with-a-long-random-string"
```

4. Run the database migration against your Neon database:

```bash
psql "$DATABASE_URL" -f migrations/001_init.sql
```

If you do not have `psql` locally, open the Neon SQL Editor and run the contents of
`migrations/001_init.sql`.

5. Start the app:

```bash
npm run dev
```

## Vercel + Neon Deployment

1. **Create a Neon Database:**
   - Go to [Neon Console](https://console.neon.tech/)
   - Create a new project named "fxdata"
   - Copy the pooled connection string (it looks like: `postgres://user:password@host.neon.tech/fxdata?sslmode=require`)

2. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - In Vercel project settings, add these environment variables:
     - `DATABASE_URL`: Your Neon pooled connection string
     - `AUTH_SECRET`: A long random string (generate one with `openssl rand -base64 32`)

3. **Run Database Migration:**
   - In Neon SQL Editor, run the contents of `migrations/001_init.sql`
   - Or use the Vercel CLI: `vercel env pull && npm run db:init`

4. **Deploy:**
   - Push to your main branch or trigger deployment in Vercel
   - Your app will be live at `https://your-project.vercel.app`
