-- =============================================================
--  Maison Azure · Villa rental schema
--  Run this script in the Supabase SQL editor on a fresh project.
--  Safe to re-run: uses `if not exists` / `or replace` everywhere.
-- =============================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------
--  Profiles (mirrors auth.users)
-- -------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Auto-create a profile row when a new auth user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -------------------------------------------------------------
--  Villas
-- -------------------------------------------------------------
create table if not exists public.villas (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  location text not null,
  price_per_night integer not null check (price_per_night > 0),
  guests integer not null check (guests > 0),
  bedrooms integer not null default 1 check (bedrooms >= 0),
  bathrooms integer not null default 1 check (bathrooms >= 0),
  amenities text[] not null default '{}',
  images text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists villas_location_idx on public.villas(location);
create index if not exists villas_price_idx on public.villas(price_per_night);
create index if not exists villas_published_idx on public.villas(is_published);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists villas_set_updated_at on public.villas;
create trigger villas_set_updated_at
  before update on public.villas
  for each row execute function public.touch_updated_at();

-- -------------------------------------------------------------
--  Bookings
-- -------------------------------------------------------------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  villa_id uuid not null references public.villas(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  guests integer not null check (guests > 0),
  total_price integer not null default 0 check (total_price >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  notes text,
  created_at timestamptz not null default now(),
  constraint bookings_valid_range check (end_date > start_date)
);

create index if not exists bookings_villa_idx on public.bookings(villa_id);
create index if not exists bookings_user_idx on public.bookings(user_id);
create index if not exists bookings_status_idx on public.bookings(status);
create index if not exists bookings_dates_idx on public.bookings(start_date, end_date);

-- Prevent overlapping non-cancelled bookings for the same villa.
create extension if not exists btree_gist;

alter table public.bookings
  drop constraint if exists bookings_no_overlap;

alter table public.bookings
  add constraint bookings_no_overlap
  exclude using gist (
    villa_id with =,
    daterange(start_date, end_date, '[)') with &&
  )
  where (status in ('pending', 'confirmed'));

-- -------------------------------------------------------------
--  Row Level Security
-- -------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.villas   enable row level security;
alter table public.bookings enable row level security;

-- helper: am I admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ---------- profiles ----------
drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Prevent regular users from elevating their own is_admin flag.
-- The service role (used by trusted server actions) is not affected by
-- column-level grants when bypassing RLS, but we still revoke for safety.
revoke update (is_admin) on public.profiles from anon, authenticated;

-- ---------- villas ----------
drop policy if exists "villas_public_read" on public.villas;
create policy "villas_public_read"
  on public.villas for select
  using (is_published or public.is_admin());

drop policy if exists "villas_admin_insert" on public.villas;
create policy "villas_admin_insert"
  on public.villas for insert
  with check (public.is_admin());

drop policy if exists "villas_admin_update" on public.villas;
create policy "villas_admin_update"
  on public.villas for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "villas_admin_delete" on public.villas;
create policy "villas_admin_delete"
  on public.villas for delete
  using (public.is_admin());

-- ---------- bookings ----------
drop policy if exists "bookings_self_select" on public.bookings;
create policy "bookings_self_select"
  on public.bookings for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "bookings_insert_self" on public.bookings;
create policy "bookings_insert_self"
  on public.bookings for insert
  with check (auth.uid() = user_id);

drop policy if exists "bookings_update_self_or_admin" on public.bookings;
create policy "bookings_update_self_or_admin"
  on public.bookings for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "bookings_delete_admin" on public.bookings;
create policy "bookings_delete_admin"
  on public.bookings for delete
  using (public.is_admin());

-- Public view: exposes ONLY the columns needed to render the
-- availability calendar on the villa details page. No PII (user_id,
-- notes, totals) is ever returned. Views default to running with the
-- owner's privileges, so this bypasses bookings RLS safely.
drop view if exists public.villa_availability;
create view public.villa_availability as
  select villa_id, start_date, end_date
  from public.bookings
  where status in ('pending', 'confirmed');

grant select on public.villa_availability to anon, authenticated;

-- -------------------------------------------------------------
--  Storage bucket for villa photos
-- -------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('villa-images', 'villa-images', true)
on conflict (id) do update set public = true;

-- Public read access to villa images.
drop policy if exists "villa images public read" on storage.objects;
create policy "villa images public read"
  on storage.objects for select
  using (bucket_id = 'villa-images');

-- Only admins can upload / overwrite / delete.
drop policy if exists "villa images admin write" on storage.objects;
create policy "villa images admin write"
  on storage.objects for insert
  with check (bucket_id = 'villa-images' and public.is_admin());

drop policy if exists "villa images admin update" on storage.objects;
create policy "villa images admin update"
  on storage.objects for update
  using (bucket_id = 'villa-images' and public.is_admin())
  with check (bucket_id = 'villa-images' and public.is_admin());

drop policy if exists "villa images admin delete" on storage.objects;
create policy "villa images admin delete"
  on storage.objects for delete
  using (bucket_id = 'villa-images' and public.is_admin());
