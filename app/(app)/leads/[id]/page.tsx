import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Topbar } from '@/components/topbar'
import { btnGhostClaro } from '@/components/ui'
import { createClient } from '@/lib/supabase/server'
import { deleteLead, updateLead } from '../actions'
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

  return (
    <>
      <Topbar
        title="Editar lead"
        actions={
          <Link href="/pipeline" className={btnGhostClaro}>
            Voltar ao pipeline
          </Link>
        }
      />
      <main className="mx-auto w-full max-w-3xl px-6 py-8">
        <LeadForm action={updateLead} lead={{ project: rest, contact }} submitLabel="Guardar" />

        <form action={deleteLead} className="mt-4 flex justify-end">
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
