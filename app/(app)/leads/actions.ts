'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isStage } from '@/lib/stages'
import type { ProjectStage } from '@/types/database'

export type LeadFormState = { error: string } | null

type LeadInput = {
  name: string
  email: string | null
  phone: string | null
  source: string | null
  eventType: string | null
  eventDate: string | null
  venue: string | null
  guestCount: number | null
  proposalTotal: number | null
  notes: string | null
  stage: ProjectStage
  title: string | null
}

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? '').trim()
  return value === '' ? null : value
}

function parseLead(formData: FormData): LeadInput | string {
  const name = text(formData, 'name')
  if (!name) return 'O nome do contacto é obrigatório.'

  const rawGuests = text(formData, 'guest_count')
  const guestCount = rawGuests === null ? null : Number(rawGuests)
  if (guestCount !== null && (!Number.isInteger(guestCount) || guestCount < 0)) {
    return 'Número de convidados inválido.'
  }

  const rawTotal = text(formData, 'proposal_total')
  const proposalTotal = rawTotal === null ? null : Number(rawTotal.replace(',', '.'))
  if (proposalTotal !== null && (!Number.isFinite(proposalTotal) || proposalTotal < 0)) {
    return 'Valor da proposta inválido.'
  }

  const rawStage = formData.get('stage')
  const stage: ProjectStage = isStage(rawStage) ? rawStage : 'new_lead'

  return {
    name,
    email: text(formData, 'email'),
    phone: text(formData, 'phone'),
    source: text(formData, 'source'),
    eventType: text(formData, 'event_type'),
    eventDate: text(formData, 'event_date'),
    venue: text(formData, 'venue'),
    guestCount,
    proposalTotal,
    notes: text(formData, 'notes'),
    stage,
    // Vazio fica null: a interface deriva "tipo · nome".
    title: text(formData, 'title'),
  }
}

export async function createLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const lead = parseLead(formData)
  if (typeof lead === 'string') return { error: lead }

  const supabase = await createClient()

  const { data: contact, error: contactError } = await supabase
    .from('contacts')
    .insert({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      type: lead.eventType,
      notes: lead.notes,
    })
    .select('id')
    .single()

  if (contactError || !contact) return { error: 'Não foi possível guardar o contacto.' }

  const { error: projectError } = await supabase.from('projects').insert({
    contact_id: contact.id,
    title: lead.title,
    event_type: lead.eventType,
    event_date: lead.eventDate,
    venue: lead.venue,
    guest_count: lead.guestCount,
    proposal_total: lead.proposalTotal,
    stage: lead.stage,
  })

  if (projectError) {
    // Sem projeto o contacto fica órfão no pipeline: desfaz.
    await supabase.from('contacts').delete().eq('id', contact.id)
    return { error: 'Não foi possível guardar o evento.' }
  }

  revalidatePath('/pipeline')
  redirect('/pipeline')
}

export async function updateLead(_prev: LeadFormState, formData: FormData): Promise<LeadFormState> {
  const projectId = String(formData.get('project_id') ?? '')
  const contactId = String(formData.get('contact_id') ?? '')
  if (!projectId || !contactId) return { error: 'Lead inválido.' }

  const lead = parseLead(formData)
  if (typeof lead === 'string') return { error: lead }

  const supabase = await createClient()

  const { error: contactError } = await supabase
    .from('contacts')
    .update({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      type: lead.eventType,
      notes: lead.notes,
    })
    .eq('id', contactId)

  if (contactError) return { error: 'Não foi possível guardar o contacto.' }

  const { error: projectError } = await supabase
    .from('projects')
    .update({
      title: lead.title,
      event_type: lead.eventType,
      event_date: lead.eventDate,
      venue: lead.venue,
      guest_count: lead.guestCount,
      proposal_total: lead.proposalTotal,
      stage: lead.stage,
    })
    .eq('id', projectId)

  if (projectError) return { error: 'Não foi possível guardar o evento.' }

  revalidatePath('/pipeline')
  redirect('/pipeline')
}

export async function moveStage(projectId: string, stage: ProjectStage) {
  if (!isStage(stage)) return

  const supabase = await createClient()
  await supabase.from('projects').update({ stage }).eq('id', projectId)

  revalidatePath('/pipeline')
}

export async function deleteLead(formData: FormData) {
  const contactId = String(formData.get('contact_id') ?? '')
  if (!contactId) return

  const supabase = await createClient()
  // projects.contact_id é on delete cascade.
  await supabase.from('contacts').delete().eq('id', contactId)

  revalidatePath('/pipeline')
  redirect('/pipeline')
}
