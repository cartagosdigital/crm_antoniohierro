'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { conteudoPorDefeito } from '@/lib/proposals-seed'
import { isLanguage, type ProposalContent } from '@/lib/proposals'
import { createClient } from '@/lib/supabase/server'
import type { Json } from '@/types/database'

// ProposalContent é uma forma fechada e Json é indexado por string: são
// compatíveis em estrutura, não em tipo. A conversão fica aqui, num sítio só.
function comoJson(content: ProposalContent) {
  return content as unknown as Json
}

// Gerar ou abrir: uma proposta por projeto e por língua. Se já existe, não
// toca no conteúdo — abre o que lá está.
export async function gerarProposta(formData: FormData) {
  const projectId = String(formData.get('project_id') ?? '')
  const language = formData.get('language')
  if (!projectId || !isLanguage(language)) return

  const supabase = await createClient()

  const { data: existente } = await supabase
    .from('proposals')
    .select('id')
    .eq('project_id', projectId)
    .eq('language', language)
    .maybeSingle()

  let id = existente?.id

  if (!id) {
    const { data: criada, error } = await supabase
      .from('proposals')
      .insert({
        project_id: projectId,
        language,
        content: comoJson(conteudoPorDefeito(language)),
      })
      .select('id')
      .single()

    // Duas submissões seguidas correm o select em paralelo e ambas tentam
    // inserir; o índice único trava a segunda. Nesse caso a proposta existe,
    // basta relê-la.
    if (error) {
      const { data: concorrente } = await supabase
        .from('proposals')
        .select('id')
        .eq('project_id', projectId)
        .eq('language', language)
        .maybeSingle()

      if (!concorrente) return
      id = concorrente.id
    } else {
      id = criada.id
    }
  }

  redirect(`/proposals/${id}`)
}

export type GuardarState = { error: string } | { ok: true } | null

export async function guardarProposta(
  id: string,
  content: ProposalContent,
): Promise<GuardarState> {
  if (!id) return { error: 'Proposta inválida.' }

  const supabase = await createClient()
  const { error } = await supabase
    .from('proposals')
    .update({ content: comoJson(content) })
    .eq('id', id)

  if (error) return { error: 'Não foi possível guardar a proposta.' }

  revalidatePath(`/proposals/${id}`)
  return { ok: true }
}
