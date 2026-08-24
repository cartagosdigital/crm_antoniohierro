import Link from 'next/link'
import { Topbar } from '@/components/topbar'
import { btnGhostClaro } from '@/components/ui'
import { createLead } from '../actions'
import { LeadForm } from '../lead-form'

export const metadata = { title: 'Novo lead · Hierro Events' }

export default function NewLeadPage() {
  return (
    <>
      <Topbar
        title="Novo lead"
        actions={
          <Link href="/pipeline" className={btnGhostClaro}>
            Voltar ao pipeline
          </Link>
        }
      />
      <main className="mx-auto w-full max-w-3xl px-6 py-8">
        <LeadForm action={createLead} submitLabel="Criar lead" />
      </main>
    </>
  )
}
