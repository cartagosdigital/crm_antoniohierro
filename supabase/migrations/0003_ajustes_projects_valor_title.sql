-- Fatia 1 · Ajustes no projects
-- proposal_total: valor da oportunidade, mostrado como "em jogo" no pipeline
-- e preenchido pelo gerador de propostas na Fatia 2.
-- title: opcional; a interface deriva "tipo · nome" quando vazio.

alter table projects add column proposal_total numeric;
alter table projects alter column title drop not null;
