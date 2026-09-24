# Job for Algerians

Next.js (App Router) + Supabase implementation of the Job for Algerians prototype.
React frontend and Node.js backend (Next.js API routes) live in one project, ready to deploy to Vercel.

## 1. Create a Supabase project

1. Go to https://supabase.com/dashboard and create a new project.
2. In **Project Settings > API**, copy the **Project URL**, **anon public key**, and **service_role key**.
3. In **SQL Editor**, paste the contents of `supabase/schema.sql` and run it. This creates the
   `profiles`, `education`, `experience`, and `admins` tables, their Row Level Security policies,
   and the `avatars` storage bucket.

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the three values from step 1:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 3. Create your admin account

1. Run the app (`npm install && npm run dev`) and register a normal account at `/register`
   using the email you want to use as admin (e.g. `admin@jobforalgerians.dz`).
2. Back in the Supabase SQL Editor, run:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'admin@jobforalgerians.dz';
   ```
3. Log in at `/admin/login` with that email and password.

## 4. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## 5. Deploy to Vercel

1. Push this project to a GitHub repo.
2. In Vercel, click **New Project**, import the repo — it's detected as Next.js automatically.
3. Add the same three environment variables from `.env.local` in the Vercel project settings.
4. Deploy. No other configuration is needed.

## How it's wired together

- **Auth**: Supabase Auth (email/password) for both candidates and admins. There's no separate
  admin login system — an admin is just a normal Supabase user whose id also appears in the
  `admins` table.
- **Database**: `profiles` (one row per candidate, keyed to `auth.users.id`), `education` and
  `experience` (one-to-many, referencing `profiles.id`).
- **Authorization**: enforced by Postgres Row Level Security, not application code. A candidate
  can only read/write their own row; an admin (checked via `public.is_admin()`) can read, update,
  and delete any row. Even the API routes rely on RLS rather than trusting the client.
- **API routes** (`app/api/**`): thin Node.js server endpoints used by the admin dashboard
  (`/api/admin/verify`, `/api/admin/candidates`, `/api/admin/candidates/[id]`). The candidate
  profile form writes to Supabase directly from the browser, which is safe because RLS restricts
  it to the signed-in user's own rows.
- **Storage**: profile photos go to the public `avatars` bucket, one folder per user id.
- **Middleware** (`middleware.js`): refreshes the Supabase session cookie on every request and
  redirects signed-out users away from `/dashboard` and `/admin`.

## Known limitations / next steps

- No password-reset flow, email verification enforcement, or rate limiting yet.
- No pagination on the admin candidate list — fine for hundreds of rows, worth adding for more.
- No file-size/type validation on avatar uploads beyond the browser's `accept="image/*"`.
- No multi-language (Arabic/French) UI yet, though the RLS/data model is language-agnostic.
