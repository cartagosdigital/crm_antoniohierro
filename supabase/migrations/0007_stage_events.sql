-- Fatia 2 · Histórico de etapas (deltas)
-- Regista cada passagem por etapa do funil. Preenchido por gatilho, nunca à mão.

create table stage_events (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  from_stage project_stage,
  to_stage   project_stage not null,
  changed_by uuid references auth.users,
  changed_at timestamptz not null default now()
);

create index on stage_events (project_id, changed_at);

alter table stage_events enable row level security;
create policy "read stage events" on stage_events
  for select to authenticated using (true);

-- regista a criação do projeto e cada mudança real de stage
create or replace function log_stage_event()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if (tg_op = 'INSERT') then
    insert into public.stage_events (project_id, from_stage, to_stage, changed_by)
    values (new.id, null, new.stage, auth.uid());
  elsif (tg_op = 'UPDATE' and new.stage is distinct from old.stage) then
    insert into public.stage_events (project_id, from_stage, to_stage, changed_by)
    values (new.id, old.stage, new.stage, auth.uid());
  end if;
  return new;
end $$;

revoke execute on function public.log_stage_event() from anon, authenticated, public;

create trigger projects_stage_event
  after insert or update on projects
  for each row execute function log_stage_event();

-- Backfill dos projetos que já existiam: sem isto ficam sem entrada inicial e
-- o "há quanto tempo nesta etapa" não tem de onde partir. Insere direto na
-- tabela, portanto não volta a passar pelo gatilho.
insert into stage_events (project_id, from_stage, to_stage, changed_at)
select id, null, stage, created_at from projects;
