# CRM Hierro Events

CRM de eventos em Next.js (App Router) + Supabase. Single-tenant: qualquer utilizador autenticado tem acesso total.

## Arrancar

```bash
npm install
cp .env.example .env.local   # preencher com o URL e a chave publicável do Supabase
npm run dev
```

Não há signup público — as contas são criadas no painel do Supabase (Authentication → Users).

## Estrutura

```
app/
  login/            entrada (signInWithPassword)
  (app)/            rotas protegidas
    pipeline/       kanban por stage
    leads/          criar e editar lead (contact + project)
components/         topbar e vocabulário visual
lib/supabase/       client (browser) e server (cookies)
lib/                stages, formatação
proxy.ts            renova a sessão e protege as rotas (era o middleware, até ao Next 15)
supabase/migrations/  espelho das migrations já aplicadas — não reaplicar
types/database.ts   tipos do schema public
```

## Base de dados

As migrations em `supabase/migrations/` já estão aplicadas no projeto Supabase; estão no repo só para o schema ficar versionado.

- `contacts` — a pessoa
- `projects` — o evento / a oportunidade, com `stage` (`diagnostico` → `qualificacao` → `reuniao_marcada` → `negociacao` → `quase_fechar` → `ganho` | `perdido`) e `proposal_total` (o valor "em jogo", somado por coluna no pipeline)
- `profiles` — espelho de `auth.users` com `role`

Um "lead" no UI é um `contact` mais um `project`, criados e editados em conjunto.

Regenerar os tipos após alterar o schema:

```bash
npx supabase gen types typescript --project-id <ref> > types/database.ts
```

## Design

Tokens (cores, fontes, sombra do cartão) em `app/globals.css`, via `@theme` do Tailwind v4.
Regra de contraste: texto sobre verde é branco ou creme; o brass só aparece sobre fundo claro.
