-- Fatia 3 · Propostas
-- Uma proposta por projeto e por língua: o conteúdo editado no construtor vive
-- em content (jsonb), com a forma descrita em lib/proposals.ts.
--
-- ATENÇÃO: escrita a partir da especificação, sem acesso ao schema remoto (o
-- conector caiu). Confirmar contra o Supabase antes de correr um db reset.

create type proposal_language as enum ('pt', 'en');

create table proposals (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  language   proposal_language not null default 'pt',
  content    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- "Uma proposta por língua" do brief, garantido na base: o gerar-ou-abrir do
-- construtor apoia-se nisto para não criar duplicados numa dupla submissão.
create unique index on proposals (project_id, language);

create trigger proposals_updated_at
  before update on proposals
  for each row execute function set_updated_at();

alter table proposals enable row level security;
create policy "full access proposals" on proposals
  for all to authenticated using (true) with check (true);
