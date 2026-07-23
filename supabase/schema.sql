-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New query)

-- Languages
create table public.languages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  goal_date date,
  goal_note text,
  created_at timestamptz not null default now()
);

alter table public.languages enable row level security;

create policy "Users own their languages"
  on public.languages
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Modules
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  language_id uuid not null references public.languages(id) on delete cascade,
  name text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.modules enable row level security;

create policy "Users own their modules"
  on public.modules
  for all
  using (
    exists (
      select 1 from public.languages l
      where l.id = modules.language_id and l.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.languages l
      where l.id = modules.language_id and l.user_id = auth.uid()
    )
  );

-- Topics
create table public.topics (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  name text not null,
  done boolean not null default false,
  resource_url text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.topics enable row level security;

create policy "Users own their topics"
  on public.topics
  for all
  using (
    exists (
      select 1
      from public.modules m
      join public.languages l on l.id = m.language_id
      where m.id = topics.module_id and l.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.modules m
      join public.languages l on l.id = m.language_id
      where m.id = topics.module_id and l.user_id = auth.uid()
    )
  );

-- Sessions
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  language_id uuid not null references public.languages(id) on delete cascade,
  module_name text not null,
  session_date date not null,
  duration_minutes int not null,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.sessions enable row level security;

create policy "Users own their sessions"
  on public.sessions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Profiles
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text,
  notif_streak boolean not null default true,
  notif_weekly boolean not null default false
);

alter table public.profiles enable row level security;

create policy "Users own their profile"
  on public.profiles
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-create profile on signup. security definer so the insert
-- bypasses RLS (trigger runs before the user has a session).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Table grants: RLS filters rows, but roles still need base privileges.
grant usage on schema public to authenticated, anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
