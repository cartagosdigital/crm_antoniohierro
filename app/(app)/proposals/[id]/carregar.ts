import { notFound } from 'next/navigation'
import { capaDerivada, capaFinal, isLanguage, parseContent } from '@/lib/proposals'
import { createClient } from '@/lib/supabase/server'

// Partilhado pelo construtor e pela rota de impressão: as duas precisam da
// proposta, do lead por trás dela e da capa já resolvida.
export async function carregarProposta(id: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from('proposals')
    .select('id, language, content, project:projects(*, contact:contacts(*))')
    .eq('id', id)
    .single()

  if (!data?.project?.contact) notFound()

  const { contact, ...project } = data.project
  const content = parseContent(data.content)
  const derivada = capaDerivada(project, contact)

  return {
    id: data.id,
    language: isLanguage(data.language) ? data.language : 'pt',
    content,
    derivada,
    cover: capaFinal(content, derivada),
    project,
    contact,
  }
}
