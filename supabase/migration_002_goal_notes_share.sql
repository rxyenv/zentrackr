-- Migration for existing databases (schema.sql already includes all of this
-- for fresh installs). Run in Supabase SQL editor.

alter table public.topics add column if not exists notes text;

alter table public.profiles add column if not exists daily_goal_minutes int not null default 30;
alter table public.profiles add column if not exists share_slug text unique;
alter table public.profiles add column if not exists share_enabled boolean not null default false;

-- Public share page. security definer RPC instead of anon RLS policies:
-- anon never gets direct table access, only this exact shape, and only
-- when the owner flipped share_enabled on.
create or replace function public.get_public_profile(slug text)
returns json
language sql
stable
security definer
set search_path = public
as $$
  select json_build_object(
    'name', p.name,
    'language', l.name,
    'goal_note', l.goal_note,
    'modules', coalesce((
      select json_agg(json_build_object(
        'name', m.name,
        'total', (select count(*) from topics t where t.module_id = m.id),
        'done', (select count(*) from topics t where t.module_id = m.id and t.done)
      ) order by m.position)
      from modules m where m.language_id = l.id
    ), '[]'::json),
    'session_dates', coalesce((
      select json_agg(distinct s.session_date)
      from sessions s where s.user_id = p.user_id
    ), '[]'::json),
    'total_minutes', coalesce((
      select sum(s.duration_minutes)
      from sessions s where s.user_id = p.user_id
    ), 0)
  )
  from profiles p
  left join lateral (
    select * from languages
    where user_id = p.user_id
    order by created_at
    limit 1
  ) l on true
  where p.share_slug = slug and p.share_enabled
  limit 1;
$$;

grant execute on function public.get_public_profile(text) to anon, authenticated;
