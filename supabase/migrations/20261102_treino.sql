-- Meu Treino: segurança por cliente e controle de edição apenas pelo administrador.
-- Execute no SQL Editor do Supabase, com o usuário proprietário do projeto.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(btrim(full_name)) between 2 and 120),
  email text not null check (email = lower(btrim(email)) and char_length(email) <= 254),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(email)
);

create table if not exists public.client_measurements (
  client_id uuid primary key references public.clients(id) on delete cascade,
  measurement_date date,
  values_cm jsonb not null default '{}'::jsonb check (jsonb_typeof(values_cm)='object'),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_plans (
  client_id uuid primary key references public.clients(id) on delete cascade,
  plan jsonb not null default '{"days":[]}'::jsonb
    check (jsonb_typeof(plan)='object' and jsonb_typeof(plan->'days')='array'),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_announcements (
  id integer primary key default 1 check(id=1),
  enabled boolean not null default false,
  title text not null default '',
  message text not null default '',
  updated_at timestamptz not null default now()
);
insert into public.site_announcements(id) values(1) on conflict(id) do nothing;

-- Função que só lê a tabela de administradores. Nenhum usuário pode editar sua própria autorização.
create or replace function public.is_treino_admin()
returns boolean language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users a where a.user_id = (select auth.uid())
  );
$$;

-- Associa um cliente previamente cadastrado ao login após confirmação do e-mail.
-- Não permite reivindicar outros e-mails nem clientes já vinculados.
create or replace function public.claim_treino_client()
returns uuid language plpgsql security definer
set search_path = ''
as $$
declare
  user_id uuid := (select auth.uid());
  verified_email text;
  client_id uuid;
begin
  if user_id is null then return null; end if;
  select lower(u.email) into verified_email
    from auth.users u where u.id=user_id and u.email_confirmed_at is not null;
  if verified_email is null then return null; end if;

  select c.id into client_id
    from public.clients c where c.auth_user_id=user_id limit 1;
  if client_id is not null then return client_id; end if;

  update public.clients c set auth_user_id=user_id
    where c.email=verified_email and c.auth_user_id is null
    returning c.id into client_id;
  return client_id;
end;
$$;

revoke all on public.admin_users, public.clients, public.client_measurements,
  public.client_plans, public.site_announcements from public, anon, authenticated;
grant select on public.admin_users to authenticated;
grant select, insert, update, delete on public.clients,
  public.client_measurements, public.client_plans, public.site_announcements to authenticated;

revoke execute on function public.is_treino_admin() from public, anon;
revoke execute on function public.claim_treino_client() from public, anon;
grant execute on function public.is_treino_admin() to authenticated;
grant execute on function public.claim_treino_client() to authenticated;

alter table public.admin_users enable row level security;
alter table public.clients enable row level security;
alter table public.client_measurements enable row level security;
alter table public.client_plans enable row level security;
alter table public.site_announcements enable row level security;

drop policy if exists admin_self on public.admin_users;
create policy admin_self on public.admin_users for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists clients_read on public.clients;
create policy clients_read on public.clients for select to authenticated
using ((select public.is_treino_admin()) or auth_user_id=(select auth.uid()));

drop policy if exists clients_insert on public.clients;
create policy clients_insert on public.clients for insert to authenticated
with check ((select public.is_treino_admin()));

drop policy if exists clients_update on public.clients;
create policy clients_update on public.clients for update to authenticated
using ((select public.is_treino_admin()))
with check ((select public.is_treino_admin()));

drop policy if exists clients_delete on public.clients;
create policy clients_delete on public.clients for delete to authenticated
using ((select public.is_treino_admin()));

drop policy if exists measures_read on public.client_measurements;
create policy measures_read on public.client_measurements for select to authenticated
using ((select public.is_treino_admin()) or exists(
  select 1 from public.clients c where c.id=client_id and c.auth_user_id=(select auth.uid())
));
drop policy if exists measures_write on public.client_measurements;
drop policy if exists measures_insert on public.client_measurements;
create policy measures_insert on public.client_measurements for insert to authenticated
with check ((select public.is_treino_admin()));
drop policy if exists measures_update on public.client_measurements;
create policy measures_update on public.client_measurements for update to authenticated
using ((select public.is_treino_admin())) with check ((select public.is_treino_admin()));
drop policy if exists measures_delete on public.client_measurements;
create policy measures_delete on public.client_measurements for delete to authenticated
using ((select public.is_treino_admin()));

drop policy if exists plans_read on public.client_plans;
create policy plans_read on public.client_plans for select to authenticated
using ((select public.is_treino_admin()) or exists(
  select 1 from public.clients c where c.id=client_id and c.auth_user_id=(select auth.uid())
));
drop policy if exists plans_write on public.client_plans;
drop policy if exists plans_insert on public.client_plans;
create policy plans_insert on public.client_plans for insert to authenticated
with check ((select public.is_treino_admin()));
drop policy if exists plans_update on public.client_plans;
create policy plans_update on public.client_plans for update to authenticated
using ((select public.is_treino_admin())) with check ((select public.is_treino_admin()));
drop policy if exists plans_delete on public.client_plans;
create policy plans_delete on public.client_plans for delete to authenticated
using ((select public.is_treino_admin()));

drop policy if exists announcements_read on public.site_announcements;
create policy announcements_read on public.site_announcements for select to authenticated using(true);
drop policy if exists announcements_write on public.site_announcements;
drop policy if exists announcements_insert on public.site_announcements;
create policy announcements_insert on public.site_announcements for insert to authenticated
with check ((select public.is_treino_admin()));
drop policy if exists announcements_update on public.site_announcements;
create policy announcements_update on public.site_announcements for update to authenticated
using ((select public.is_treino_admin())) with check ((select public.is_treino_admin()));
drop policy if exists announcements_delete on public.site_announcements;
create policy announcements_delete on public.site_announcements for delete to authenticated
using ((select public.is_treino_admin()));

-- Próximo passo MANUAL: após cadastrar sua conta em Authentication → Users,
-- execute, substituindo o UUID pelo SEU UID (nunca por email sem verificar):
-- insert into public.admin_users(user_id) values ('SEU-UUID-AQUI')
-- on conflict(user_id) do nothing;

-- Atualização de planos em massa numa única transação (não altera medições).
create or replace function public.admin_apply_plan_to_all(new_plan jsonb)
returns integer
language plpgsql security definer set search_path = ''
as $$
declare changed_rows integer;
begin
  if not (select public.is_treino_admin()) then
    raise exception 'Acesso não autorizado';
  end if;
  if new_plan is null or jsonb_typeof(new_plan) <> 'object'
      or jsonb_typeof(new_plan->'days') <> 'array'
      or jsonb_array_length(new_plan->'days') > 15 then
    raise exception 'Plano inválido';
  end if;
  insert into public.client_plans (client_id,plan,updated_at)
    select c.id,new_plan,now() from public.clients c
    on conflict (client_id) do update
      set plan=excluded.plan,updated_at=excluded.updated_at;
  get diagnostics changed_rows = row_count;
  return changed_rows;
end;
$$;
revoke all on function public.admin_apply_plan_to_all(jsonb) from public,anon;
grant execute on function public.admin_apply_plan_to_all(jsonb) to authenticated;
