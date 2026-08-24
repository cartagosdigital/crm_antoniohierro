import Link from 'next/link'
import { Topbar } from '@/components/topbar'
import { btnGhostClaro } from '@/components/ui'
import { createTemplate } from '../actions'
import { TemplateForm } from '../template-form'

export const metadata = { title: 'Novo template · Hierro Events' }

export default function NewTemplatePage() {
  return (
    <>
      <Topbar
        title="Novo template"
        actions={
          <Link href="/templates" className={btnGhostClaro}>
            Voltar aos templates
          </Link>
        }
      />
      <main className="mx-auto w-full max-w-3xl px-6 py-8">
        <TemplateForm action={createTemplate} submitLabel="Criar template" />
      </main>
    </>
  )
}
