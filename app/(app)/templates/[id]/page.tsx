import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Topbar } from '@/components/topbar'
import { btnGhostClaro } from '@/components/ui'
import { createClient } from '@/lib/supabase/server'
import { deleteTemplate, updateTemplate } from '../actions'
import { TemplateForm } from '../template-form'

export const metadata = { title: 'Editar template · Hierro Events' }

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: template } = await supabase
    .from('message_templates')
    .select('*')
    .eq('id', id)
    .single()

  if (!template) notFound()

  return (
    <>
      <Topbar
        title="Editar template"
        actions={
          <Link href="/templates" className={btnGhostClaro}>
            Voltar aos templates
          </Link>
        }
      />
      <main className="mx-auto w-full max-w-3xl px-6 py-8">
        <TemplateForm action={updateTemplate} template={template} submitLabel="Guardar" />

        <form action={deleteTemplate} className="mt-4 flex justify-end">
          <input type="hidden" name="id" value={template.id} />
          <button
            type="submit"
            className="rounded-md px-3 py-2 text-sm text-clay transition hover:bg-clay/10"
          >
            Eliminar template
          </button>
        </form>
      </main>
    </>
  )
}
