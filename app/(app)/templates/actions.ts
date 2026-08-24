'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isStage } from '@/lib/stages'
import { isCanal } from '@/lib/templates'
import type { ProjectStage } from '@/types/database'

export type TemplateFormState = { error: string } | null

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? '').trim()
  return value === '' ? null : value
}

function parseTemplate(formData: FormData) {
  const name = text(formData, 'name')
  if (!name) return 'O nome do template é obrigatório.'

  const body = text(formData, 'body')
  if (!body) return 'O corpo da mensagem é obrigatório.'

  const channel = formData.get('channel')
  if (!isCanal(channel)) return 'Canal inválido.'

  const rawStage = formData.get('stage')
  const stage: ProjectStage | null = isStage(rawStage) ? rawStage : null

  return {
    name,
    channel,
    category: text(formData, 'category') ?? 'comercial',
    // O assunto só existe em email; no WhatsApp é descartado.
    subject: channel === 'email' ? text(formData, 'subject') : null,
    body,
    stage,
  }
}

export async function createTemplate(
  _prev: TemplateFormState,
  formData: FormData,
): Promise<TemplateFormState> {
  const template = parseTemplate(formData)
  if (typeof template === 'string') return { error: template }

  const supabase = await createClient()
  const { error } = await supabase.from('message_templates').insert(template)

  if (error) return { error: 'Não foi possível guardar o template.' }

  revalidatePath('/templates')
  redirect('/templates')
}

export async function updateTemplate(
  _prev: TemplateFormState,
  formData: FormData,
): Promise<TemplateFormState> {
  const id = String(formData.get('id') ?? '')
  if (!id) return { error: 'Template inválido.' }

  const template = parseTemplate(formData)
  if (typeof template === 'string') return { error: template }

  const supabase = await createClient()
  const { error } = await supabase.from('message_templates').update(template).eq('id', id)

  if (error) return { error: 'Não foi possível guardar o template.' }

  revalidatePath('/templates')
  redirect('/templates')
}

export async function duplicateTemplate(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  const { data: original } = await supabase
    .from('message_templates')
    .select('name, channel, category, subject, body, stage')
    .eq('id', id)
    .single()

  if (!original) return

  await supabase
    .from('message_templates')
    .insert({ ...original, name: `${original.name} (cópia)` })

  revalidatePath('/templates')
}

export async function deleteTemplate(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return

  const supabase = await createClient()
  await supabase.from('message_templates').delete().eq('id', id)

  revalidatePath('/templates')
  redirect('/templates')
}
