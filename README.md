# Maison Azure — Boutique villa rentals

A complete, production-ready villa rental web application built with **Next.js
15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase**
(Postgres, Auth, Storage). It includes a public site, full authentication,
a real booking system with conflict prevention, and an admin dashboard for
managing villas, images, and bookings.

> Designed to deploy to Vercel in under 10 minutes.

---

## Features

### Public site
- Modern, mobile-first hero, featured villas, and marketing sections (`/`)
- Villa catalog with filters by search, location, guests, and price (`/villas`)
- Villa details page with image gallery & lightbox, amenities, availability
  calendar, and an inline booking form (`/villas/[slug]`)
- About and Contact pages, plus a working contact API endpoint
- SEO basics: dynamic OpenGraph metadata, sitemap, robots, theme color

### Auth
- Email + password sign up / sign in via Supabase Auth
- Auto-created `profiles` row via Postgres trigger
- Protected routes via Next.js middleware (`/account`, `/admin`)
- Sign-out via dedicated route handler

### Booking system
- Authenticated users request bookings from any villa page
- Server actions validate dates, guest count, past dates, and price
- Double-booking is prevented in **two places**:
  - Application-level overlap check before insert
  - Database-level `EXCLUDE` constraint using `daterange` + `btree_gist`
- Bookings appear in the user's `/account` and the admin `/admin/bookings`
- Users can cancel their own bookings; admins can update any status

### Admin dashboard
- `/admin` snapshot of villas, bookings, and pending requests
- `/admin/villas` list with publish state, with create / edit / delete
- Drag-and-drop friendly multi-image upload directly to Supabase Storage
- `/admin/bookings` table with inline status changes and filters
- Access control checked in three layers: middleware, layout, and server actions

### Data model

| Table       | Highlights |
|-------------|------------|
| `profiles`  | mirrors `auth.users`, holds `is_admin` flag |
| `villas`    | slug, title, description, location, price, capacity, amenities[], images[], publication flag |
| `bookings`  | user_id, villa_id, dates, guests, total, status, notes, overlap-exclusion constraint |

All tables have **Row Level Security** enabled with policies for owners
(read/write your own data), admins (read/write everything), and the public
(read published villas).

---

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) — Postgres, Auth, Storage
  - `@supabase/ssr` for App Router cookie-based sessions
- [Zod](https://zod.dev/) for input validation
- [date-fns](https://date-fns.org/) for date math
- [lucide-react](https://lucide.dev/) icons

---

## Project structure

```
villas/
├─ middleware.ts                     # Auth refresh + protected route guard
├─ next.config.mjs                   # Image domains, server actions
├─ tailwind.config.ts                # Custom brand palette
├─ supabase/
│  ├─ schema.sql                     # Tables, RLS, storage policies, trigger
│  └─ seed.sql                       # Six sample villas
└─ src/
   ├─ actions/                       # Server actions (auth, villas, bookings)
   ├─ app/                           # App Router pages, layouts, route handlers
   │  ├─ (public pages)
   │  ├─ account/                    # User bookings (protected)
   │  ├─ admin/                      # Dashboard (admin only)
   │  ├─ auth/                       # callback + signout
   │  └─ api/contact/                # Contact form endpoint
   ├─ components/                    # Reusable UI + feature components
   └─ lib/
      ├─ supabase/                   # client.ts / server.ts / middleware.ts / admin.ts
      ├─ types.ts                    # Database TS types
      ├─ utils.ts                    # cn, formatCurrency, slugify…
      ├─ constants.ts                # Amenities, bucket name, site config
      └─ auth.ts                     # getCurrentUser / isCurrentUserAdmin
```

---

## Quick start

### 1. Clone & install

```bash
git clone <your-repo-url> villas
cd villas
npm install
```

> Requires **Node.js 18.18+** (Vercel and Next 15 minimum).

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com/) and create a new project.
2. Once the database is ready, open **SQL Editor → New query** and paste the
   contents of [`supabase/schema.sql`](./supabase/schema.sql). Run it.
3. *(Optional)* Run [`supabase/seed.sql`](./supabase/seed.sql) to load six
   sample villas with photos.
4. **Storage bucket** — the schema script creates a public bucket called
   `villa-images` automatically with the right policies. You can verify it
   in **Storage** in the Supabase dashboard.

### 3. Configure environment variables

Copy the example file and fill in the values from
**Supabase → Settings → API**:

```bash
cp .env.example .env.local
```

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_EMAILS=you@example.com
```

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public Supabase URL (safe in browser) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (safe in browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only.** Used by `/admin/bookings` to join user profile data. Never expose to the browser. |
| `NEXT_PUBLIC_SITE_URL` | Used for absolute URLs (OAuth callback, sitemap, OG) |
| `ADMIN_EMAILS` | Comma-separated emails granted admin access in the UI even before flipping `is_admin = true` on their profile |

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Make yourself an admin

1. Sign up at `/signup` with the same email you put in `ADMIN_EMAILS`.
2. *(Optional)* Or, in the Supabase SQL editor:
   ```sql
   update public.profiles
   set is_admin = true
   where email = 'you@example.com';
   ```
3. Visit `/admin` — you should see the dashboard.

---

## Deployment to Vercel

The app is 100% serverless-friendly and deploys cleanly to Vercel.

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:your-username/villas.git
git push -u origin main
```

### 2. Import the project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your repository.
3. Framework preset is auto-detected as **Next.js**. Leave defaults.

### 3. Add environment variables

In **Project → Settings → Environment Variables**, add (for **Production**,
**Preview**, and **Development**):

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | from Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | from Supabase dashboard (mark as **Sensitive**) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` (or the Vercel URL) |
| `ADMIN_EMAILS` | `you@example.com,teammate@example.com` |

### 4. Update Supabase Auth redirects

In **Supabase → Authentication → URL Configuration**:

- **Site URL** → `https://your-domain.com`
- **Redirect URLs** → add `https://your-domain.com/auth/callback`
  and any Vercel preview URLs (`https://*.vercel.app/auth/callback`)

### 5. Deploy

Click **Deploy** in Vercel. Future pushes to `main` (and PRs) deploy
automatically.

---

## Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server on `localhost:3000` |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Strict TypeScript check |

---

## How the booking flow works

1. A signed-in visitor fills the booking form on `/villas/[slug]`.
2. The form calls the `createBookingAction` server action with start, end,
   and guest count.
3. The action:
   - Validates input with Zod
   - Loads the villa (and rejects unpublished ones)
   - Runs an overlap query against `pending`/`confirmed` bookings
   - Inserts the booking with status `pending`
4. The Postgres `EXCLUDE` constraint also guards against any race condition.
5. The admin can confirm/cancel the booking from `/admin/bookings`.
6. The villa details page calendar marks blocked ranges automatically.

---

## Customization

- **Branding** — edit `src/lib/constants.ts` (`SITE_NAME`, `SITE_TAGLINE`,
  amenities list) and `tailwind.config.ts` to change the palette.
- **Currency** — default is USD. Change in `src/lib/utils.ts → formatCurrency`.
- **Emails** — the contact form just logs to the server console.
  Wire it up to Resend, Postmark, or Slack inside
  `src/app/api/contact/route.ts`.
- **Payments** — booking status defaults to `pending`. To accept money,
  integrate Stripe Checkout inside `createBookingAction` and confirm on
  the webhook.

---

## License

MIT — do whatever you want, but no warranties. Have fun building 🌿
