-- Adotar o funil real do António (substitui as etapas genéricas)

alter type project_stage rename to project_stage_old;

create type project_stage as enum (
  'diagnostico', 'qualificacao', 'reuniao_marcada',
  'negociacao', 'quase_fechar', 'ganho', 'perdido'
);

-- mapa antigo -> novo (aplicado a todas as colunas que usam o tipo)
-- new_lead->diagnostico, contacted->qualificacao, proposal_sent/negotiation->negociacao,
-- won->ganho, lost->perdido

alter table projects alter column stage drop default;

alter table projects alter column stage type project_stage using (
  case stage::text
    when 'new_lead' then 'diagnostico'
    when 'contacted' then 'qualificacao'
    when 'proposal_sent' then 'negociacao'
    when 'negotiation' then 'negociacao'
    when 'won' then 'ganho'
    when 'lost' then 'perdido'
    else 'diagnostico'
  end::project_stage
);

alter table projects alter column stage set default 'diagnostico';

alter table stage_events alter column to_stage type project_stage using (
  case to_stage::text
    when 'new_lead' then 'diagnostico'
    when 'contacted' then 'qualificacao'
    when 'proposal_sent' then 'negociacao'
    when 'negotiation' then 'negociacao'
    when 'won' then 'ganho'
    when 'lost' then 'perdido'
    else 'diagnostico'
  end::project_stage
);

alter table stage_events alter column from_stage type project_stage using (
  case from_stage::text
    when 'new_lead' then 'diagnostico'
    when 'contacted' then 'qualificacao'
    when 'proposal_sent' then 'negociacao'
    when 'negotiation' then 'negociacao'
    when 'won' then 'ganho'
    when 'lost' then 'perdido'
    else null
  end::project_stage
);

alter table message_templates alter column stage type project_stage using (
  case stage::text
    when 'new_lead' then 'diagnostico'
    when 'contacted' then 'qualificacao'
    when 'proposal_sent' then 'negociacao'
    when 'negotiation' then 'negociacao'
    when 'won' then 'ganho'
    when 'lost' then 'perdido'
    else null
  end::project_stage
);

drop type project_stage_old;
