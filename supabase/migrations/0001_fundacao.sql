-- Fatia 0 · Fundação
-- Auth (profiles + papéis), núcleo do CRM (contacts, projects), triggers e RLS.
-- Single-tenant: utilizadores autenticados têm acesso total.

create extension if not exists pgcrypto;

-- ---------- helpers ----------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- profiles ----------
create type user_role as enum ('admin', 'member');

create table profiles (
  id         uuid primary key references auth.users on delete cascade,
  full_name  text,
  role       user_role not null default 'member',
  created_at timestamptz not null default now()
);

-- cria o profile automaticamente a cada novo utilizador
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------- contacts ----------
create table contacts (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text,
  phone      text,
  source     text,          -- indicação, instagram, site, ...
  type       text,          -- casamento, corporativo, ...
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger contacts_updated_at
  before update on contacts
  for each row execute function set_updated_at();

-- ---------- projects (evento / oportunidade) ----------
create type project_stage as enum (
  'new_lead', 'contacted', 'proposal_sent', 'negotiation', 'won', 'lost'
);

create table projects (
  id          uuid primary key default gen_random_uuid(),
  contact_id  uuid not null references contacts on delete cascade,
  title       text not null,
  event_type  text,          -- casamento, corporativo, ...
  event_date  date,
  venue       text,
  guest_count int,
  stage       project_stage not null default 'new_lead',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index on projects (contact_id);
create index on projects (stage);

create trigger projects_updated_at
  before update on projects
  for each row execute function set_updated_at();

-- ---------- RLS ----------
alter table profiles enable row level security;
alter table contacts enable row level security;
alter table projects enable row level security;

create policy "read profiles" on profiles
  for select to authenticated using (true);

create policy "update own profile" on profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "full access contacts" on contacts
  for all to authenticated using (true) with check (true);

create policy "full access projects" on projects
  for all to authenticated using (true) with check (true);
