import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Guarda de sessão do lado do servidor (o proxy faz a verificação otimista).
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <>{children}</>
}
