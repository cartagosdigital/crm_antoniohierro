-- Fatia 1 · Captura de leads do formulário
-- session_id correlaciona as capturas parciais do widget (upsert), sem duplicar o lead.

alter table contacts add column session_id text unique;
