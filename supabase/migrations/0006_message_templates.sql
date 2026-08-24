-- Fatia 2 · Templates de mensagem
-- Modelos de email e WhatsApp, com campos de merge ({cliente}, {data}, ...)
-- resolvidos na interface no momento do envio.

create type message_channel as enum ('email', 'whatsapp');

create table message_templates (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  channel    message_channel not null,
  category   text not null default 'comercial',   -- comercial | operacao
  subject    text,                                 -- usado só em email
  body       text not null,
  stage      project_stage,                        -- etapa sugerida (opcional)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger message_templates_updated_at
  before update on message_templates
  for each row execute function set_updated_at();

alter table message_templates enable row level security;
create policy "full access templates" on message_templates
  for all to authenticated using (true) with check (true);
