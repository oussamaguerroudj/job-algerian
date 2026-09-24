-- Run this whole file once in the Supabase SQL Editor (Project > SQL Editor > New query).

create extension if not exists pgcrypto;

-- 1. Profiles Table: Candidates submit their info directly without needing an auth account.
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  dob date,
  email text,
  phone text,
  address text,
  photo_url text,
  other text,
  completion int default 0,
  submitted_at timestamptz default now(),
  created_at timestamptz default now()
);

alter table public.profiles add column if not exists other text;

-- 2. Education Table
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  school text,
  degree text,
  field text,
  year text
);

-- 3. Experience Table
create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  company text,
  title text,
  start_date text,
  end_date text,
  description text
);

-- 4. Admin Credentials Table: Stores the active administrator email and hashed password directly in DB.
create table if not exists public.admin_credentials (
  id int primary key default 1,
  email text not null,
  password_hash text not null,
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

-- Insert standard default admin credentials if not already present
-- Default Email: admin@jobforalgerians.dz / Password: admin123456
insert into public.admin_credentials (id, email, password_hash)
values (
  1,
  'admin@jobforalgerians.dz',
  '4a2b918c5e6f3d12:00000000000000000000000000000000'
)
on conflict (id) do nothing;

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.education enable row level security;
alter table public.experience enable row level security;
alter table public.admin_credentials enable row level security;

-- Drop previous policies to avoid conflicts
drop policy if exists "allow_public_insert_profiles" on public.profiles;
drop policy if exists "allow_select_profiles" on public.profiles;
drop policy if exists "allow_delete_profiles" on public.profiles;
drop policy if exists "allow_public_insert_education" on public.education;
drop policy if exists "allow_select_education" on public.education;
drop policy if exists "allow_public_insert_experience" on public.experience;
drop policy if exists "allow_select_experience" on public.experience;
drop policy if exists "allow_admin_creds_all" on public.admin_credentials;

-- Candidate submission & read policies
create policy "allow_public_insert_profiles" on public.profiles for insert with check (true);
create policy "allow_select_profiles" on public.profiles for select using (true);
create policy "allow_delete_profiles" on public.profiles for delete using (true);

create policy "allow_public_insert_education" on public.education for insert with check (true);
create policy "allow_select_education" on public.education for select using (true);

create policy "allow_public_insert_experience" on public.experience for insert with check (true);
create policy "allow_select_experience" on public.experience for select using (true);

create policy "allow_admin_creds_all" on public.admin_credentials for all using (true) with check (true);

-- Storage bucket for candidate profile photos
insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict (id) do update set public = true;

drop policy if exists "avatar_public_read" on storage.objects;
drop policy if exists "avatar_public_upload" on storage.objects;

create policy "avatar_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatar_public_upload" on storage.objects
  for insert with check (bucket_id = 'avatars');
