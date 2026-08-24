-- Fatia 1 · Captura de leads do formulário
-- O widget captura por fases: o lead entra no CRM assim que há sessionId,
-- e o nome chega numa captura posterior. O formulário do CRM continua a exigi-lo.

alter table contacts alter column name drop not null;
