create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.sessions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  split_name text not null,
  notes text,
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.nutrition_entries (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  meal_name text not null,
  calories numeric not null default 0,
  protein_g numeric not null default 0,
  carbs_g numeric not null default 0,
  fats_g numeric not null default 0,
  notes text,
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.bodyweight_entries (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  weight_kg numeric not null,
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.sleep_entries (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  hours numeric not null,
  quality integer not null default 3,
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.step_entries (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  total_steps integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

create table if not exists public.templates (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  split_name text not null,
  exercises jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz
);

alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.nutrition_entries enable row level security;
alter table public.bodyweight_entries enable row level security;
alter table public.sleep_entries enable row level security;
alter table public.step_entries enable row level security;
alter table public.templates enable row level security;

create policy "profiles own rows" on public.profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "sessions own rows" on public.sessions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "nutrition own rows" on public.nutrition_entries
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "bodyweight own rows" on public.bodyweight_entries
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "sleep own rows" on public.sleep_entries
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "steps own rows" on public.step_entries
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "templates own rows" on public.templates
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
