-- Fatia 0 · Hardening das funções (advisor de segurança)
-- Fixa o search_path e remove a execução via RPC das funções internas.

alter function public.set_updated_at() set search_path = '';
alter function public.handle_new_user() set search_path = '';

revoke execute on function public.set_updated_at() from anon, authenticated, public;
revoke execute on function public.handle_new_user() from anon, authenticated, public;
