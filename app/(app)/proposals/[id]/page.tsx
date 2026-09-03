import Link from 'next/link'
import { Topbar } from '@/components/topbar'
import { btnGhostClaro } from '@/components/ui'
import { Builder } from './builder'
import { carregarProposta } from './carregar'

export const metadata = { title: 'Proposta · Hierro Events' }

export default async function ProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { language, content, derivada, project } = await carregarProposta(id)

  return (
    <>
      <Topbar
        title="Proposta"
        actions={
          <Link href={`/leads/${project.id}`} className={btnGhostClaro}>
            Voltar ao lead
          </Link>
        }
      />

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-6 py-6">
        <Builder
          id={id}
          projectId={project.id}
          language={language}
          inicial={content}
          derivada={derivada}
        />
      </main>
    </>
  )
}
