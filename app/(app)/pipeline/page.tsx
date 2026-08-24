import Link from 'next/link'
import { Topbar } from '@/components/topbar'
import { btnBrass, btnGhostClaro } from '@/components/ui'
import { todayISO } from '@/lib/format'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/login/actions'
import { Board, type BoardCard } from './board'

export const metadata = { title: 'Pipeline · Hierro Events' }

export default async function PipelinePage() {
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from('projects')
    .select(
      'id, stage, title, event_type, event_date, guest_count, proposal_total, venue, contact:contacts(name)',
    )
    .order('event_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  const cards: BoardCard[] = (projects ?? []).map((p) => ({
    id: p.id,
    stage: p.stage,
    title: p.title,
    eventType: p.event_type,
    eventDate: p.event_date,
    proposalTotal: p.proposal_total,
    venue: p.venue,
    contactName: p.contact?.name ?? 'Sem contacto',
  }))

  return (
    <>
      <Topbar
        title="Pipeline"
        actions={
          <>
            <Link href="/templates" className={btnGhostClaro}>
              Templates
            </Link>
            <form action={signOut}>
              <button type="submit" className={btnGhostClaro}>
                Sair
              </button>
            </form>
            <Link href="/leads/new" className={btnBrass}>
              Novo lead
            </Link>
          </>
        }
      />

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-6 py-6">
        {error ? (
          <p role="alert" className="text-sm text-clay">
            Não foi possível carregar o pipeline.
          </p>
        ) : (
          <Board cards={cards} today={todayISO()} />
        )}
      </main>
    </>
  )
}
