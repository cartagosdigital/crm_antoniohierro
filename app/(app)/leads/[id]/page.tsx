import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Topbar } from '@/components/topbar'
import { btnGhostClaro } from '@/components/ui'
import { tempoDesde } from '@/lib/format'
import { dadosMerge } from '@/lib/merge'
import { stageLabel } from '@/lib/stages'
import { createClient } from '@/lib/supabase/server'
import { deleteLead, updateLead } from '../actions'
import { Composer } from '../composer'
import { LeadForm } from '../lead-form'

export const metadata = { title: 'Editar lead · Hierro Events' }

export default async function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects')
    .select('*, contact:contacts(*)')
    .eq('id', id)
    .single()

  if (!project?.contact) notFound()

  const { contact, ...rest } = project

  // Os templates e o histórico são acessórios: se falharem, a edição do lead
  // continua a funcionar.
  const [{ data: templates }, { data: ultimoEvento }] = await Promise.all([
    supabase
      .from('message_templates')
      .select('*')
      .eq('category', 'comercial')
      .order('name'),
    supabase
      .from('stage_events')
      .select('changed_at')
      .eq('project_id', id)
      .order('changed_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  return (
    <>
      <Topbar
        title="Editar lead"
        actions={
          <>
            <Link href="/templates" className={btnGhostClaro}>
              Templates
            </Link>
            <Link href="/pipeline" className={btnGhostClaro}>
              Voltar ao pipeline
            </Link>
          </>
        }
      />
      <main className="mx-auto w-full max-w-3xl space-y-4 px-6 py-8">
        <p className="text-xs text-tinta-suave">
          <span className="font-medium text-tinta">{stageLabel(rest.stage)}</span>
          {ultimoEvento && <> · nesta etapa {tempoDesde(ultimoEvento.changed_at)}</>}
        </p>

        <LeadForm action={updateLead} lead={{ project: rest, contact }} submitLabel="Guardar" />

        <Composer
          templates={templates ?? []}
          dados={dadosMerge(rest, contact)}
          destino={{ email: contact.email, phone: contact.phone }}
        />

        <form action={deleteLead} className="flex justify-end">
          <input type="hidden" name="contact_id" value={contact.id} />
          <button
            type="submit"
            className="rounded-md px-3 py-2 text-sm text-clay transition hover:bg-clay/10"
          >
            Eliminar lead
          </button>
        </form>
      </main>
    </>
  )
}
