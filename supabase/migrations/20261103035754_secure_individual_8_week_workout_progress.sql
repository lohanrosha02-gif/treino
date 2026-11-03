-- Stores each approved client's evaluation and training history privately.
-- This migration is already applied to the connected Supabase project; keep it
-- in the repository so fresh installations receive the same schema and rules.

create table if not exists public.client_progress (
  client_id uuid primary key references public.clients(id) on delete cascade,
  progress jsonb not null default '{"version":2,"evaluation":{"date":"","values":{}},"weeks":[{},{},{},{},{},{},{},{}],"legacyWeeklyMeasures":[]}'::jsonb
    check (pg_column_size(progress) < 2097152),
  updated_at timestamptz not null default now()
);

revoke all on public.client_progress from public, anon, authenticated;
grant select, insert, update on public.client_progress to authenticated;

alter table public.client_progress enable row level security;

drop policy if exists progress_read on public.client_progress;
create policy progress_read on public.client_progress for select to authenticated
using (
  (select public.is_treino_admin())
  or exists (
    select 1 from public.clients c
     where c.id = client_id
       and c.auth_user_id = (select auth.uid())
       and c.approval_status = 'approved'
  )
);

drop policy if exists progress_insert on public.client_progress;
create policy progress_insert on public.client_progress for insert to authenticated
with check (exists (
  select 1 from public.clients c
   where c.id = client_id
     and c.auth_user_id = (select auth.uid())
     and c.approval_status = 'approved'
));

drop policy if exists progress_update on public.client_progress;
create policy progress_update on public.client_progress for update to authenticated
using (exists (
  select 1 from public.clients c
   where c.id = client_id
     and c.auth_user_id = (select auth.uid())
     and c.approval_status = 'approved'
))
with check (exists (
  select 1 from public.clients c
   where c.id = client_id
     and c.auth_user_id = (select auth.uid())
     and c.approval_status = 'approved'
));
