-- Completes the admin approval flow used by treino-v2/client-supabase.js.
-- This migration is already applied to the connected Supabase project; keep it
-- in the repository so fresh installations receive the same schema and rules.

alter table public.clients
  add column if not exists approval_status text not null default 'pending',
  add column if not exists approved_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.clients'::regclass
      and conname = 'clients_approval_status_check'
  ) then
    alter table public.clients
      add constraint clients_approval_status_check
      check (approval_status in ('pending', 'approved'));
  end if;
end;
$$;

create index if not exists clients_approval_status_idx
  on public.clients (approval_status);

create or replace function public.register_treino_client()
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  verified_email text;
  student_name text;
  result_id uuid;
begin
  if current_user_id is null then
    return null;
  end if;

  -- The email must be verified by Supabase Auth. User metadata is used only
  -- for the display name and never for authorization.
  select lower(btrim(u.email)),
         left(btrim(coalesce(u.raw_user_meta_data ->> 'full_name', '')), 120)
    into verified_email, student_name
    from auth.users u
   where u.id = current_user_id
     and u.email_confirmed_at is not null
     and u.is_anonymous is not true;

  if verified_email is null or verified_email = '' then
    return null;
  end if;

  if char_length(student_name) < 2 then
    student_name := 'Aluno ' || left(split_part(verified_email, '@', 1), 60);
  end if;

  select c.id into result_id
    from public.clients c
   where c.auth_user_id = current_user_id
   limit 1;

  if result_id is not null then
    return result_id;
  end if;

  -- Link a pre-created admin record only when its verified email is unused.
  update public.clients c
     set auth_user_id = current_user_id
   where c.email = verified_email
     and c.auth_user_id is null
  returning c.id into result_id;

  if result_id is not null then
    return result_id;
  end if;

  -- Self-registration creates a pending account with no access to measurements
  -- or plans until an administrator approves it.
  insert into public.clients (full_name, email, auth_user_id, approval_status)
  values (student_name, verified_email, current_user_id, 'pending')
  on conflict (email) do nothing
  returning id into result_id;

  return result_id;
end;
$$;

-- Keep the earlier RPC name working for clients that still use it.
create or replace function public.claim_treino_client()
returns uuid
language sql
set search_path = ''
as $$
  select public.register_treino_client();
$$;

revoke all on function public.register_treino_client() from public, anon;
grant execute on function public.register_treino_client() to authenticated;
revoke all on function public.claim_treino_client() from public, anon;
grant execute on function public.claim_treino_client() to authenticated;

drop policy if exists measures_read on public.client_measurements;
create policy measures_read on public.client_measurements for select to authenticated
using (
  (select public.is_treino_admin())
  or exists (
    select 1 from public.clients c
     where c.id = client_id
       and c.auth_user_id = (select auth.uid())
       and c.approval_status = 'approved'
  )
);

drop policy if exists plans_read on public.client_plans;
create policy plans_read on public.client_plans for select to authenticated
using (
  (select public.is_treino_admin())
  or exists (
    select 1 from public.clients c
     where c.id = client_id
       and c.auth_user_id = (select auth.uid())
       and c.approval_status = 'approved'
  )
);
