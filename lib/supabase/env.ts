// As variáveis têm de ser lidas como literais (process.env.NOME) para o bundler
// as inlinar no browser — process.env[nome] não funcionaria do lado do cliente.
export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    const falta = [
      !url && 'NEXT_PUBLIC_SUPABASE_URL',
      !key && 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ]
      .filter(Boolean)
      .join(' e ')

    throw new Error(
      `Supabase por configurar: falta ${falta}. ` +
        'Em local, definir no .env.local; no deploy, nas Environment Variables do projeto ' +
        '(e voltar a fazer deploy — as variáveis não se aplicam a um deploy já feito).',
    )
  }

  return { url, key }
}
