'use client'

import Link from 'next/link'
import { startTransition, useOptimistic, useState } from 'react'
import { Avatar, Chip } from '@/components/ui'
import { formatEuros, formatEventDate, initials, isPast, leadTitle } from '@/lib/format'
import { STAGES } from '@/lib/stages'
import { moveStage } from '../leads/actions'
import type { ProjectStage } from '@/types/database'

export type BoardCard = {
  id: string
  stage: ProjectStage
  title: string | null
  eventType: string | null
  eventDate: string | null
  proposalTotal: number | null
  venue: string | null
  contactName: string
}

export function Board({ cards, today }: { cards: BoardCard[]; today: string }) {
  const [optimisticCards, applyMove] = useOptimistic(
    cards,
    (state: BoardCard[], move: { id: string; stage: ProjectStage }) =>
      state.map((c) => (c.id === move.id ? { ...c, stage: move.stage } : c)),
  )
  const [dragOver, setDragOver] = useState<ProjectStage | null>(null)

  function drop(stage: ProjectStage, event: React.DragEvent) {
    event.preventDefault()
    setDragOver(null)

    const id = event.dataTransfer.getData('text/plain')
    const card = optimisticCards.find((c) => c.id === id)
    if (!card || card.stage === stage) return

    startTransition(async () => {
      applyMove({ id, stage })
      await moveStage(id, stage)
    })
  }

  return (
    <div className="flex items-start gap-4 overflow-x-auto pb-4">
      {STAGES.map((stage) => {
        const columnCards = optimisticCards.filter((c) => c.stage === stage.value)
        const total = columnCards.reduce((sum, c) => sum + (c.proposalTotal ?? 0), 0)

        return (
          <section
            key={stage.value}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(stage.value)
            }}
            onDragLeave={() => setDragOver((s) => (s === stage.value ? null : s))}
            onDrop={(e) => drop(stage.value, e)}
            className={`flex max-h-[calc(100vh-9rem)] w-72 shrink-0 flex-col rounded-lg border bg-papel transition ${
              dragOver === stage.value ? 'border-musgo bg-musgo/5' : 'border-pedra'
            }`}
          >
            <header className="flex shrink-0 items-baseline gap-2 border-b border-pedra px-4 py-3">
              <h2 className="font-display text-sm font-semibold text-floresta">{stage.label}</h2>
              <span className="tabular rounded-full bg-pedra/60 px-1.5 text-[11px] text-tinta-suave">
                {columnCards.length}
              </span>
              <span className="tabular ml-auto text-xs font-medium text-latao">
                {total > 0 ? formatEuros(total) : '—'}
              </span>
            </header>

            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3">
              {columnCards.map((card) => (
                <Card key={card.id} card={card} today={today} />
              ))}

              {columnCards.length === 0 && (
                <p className="rounded-md border border-dashed border-pedra-esc px-3 py-6 text-center text-xs text-tinta-suave/70">
                  Sem leads
                </p>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function Card({ card, today }: { card: BoardCard; today: string }) {
  const vencido =
    isPast(card.eventDate, today) && card.stage !== 'ganho' && card.stage !== 'perdido'

  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', card.id)
        e.dataTransfer.effectAllowed = 'move'
      }}
      className="relative cursor-grab rounded-lg border border-pedra bg-branco p-3 shadow-cartao transition hover:border-pedra-esc active:cursor-grabbing"
    >
      <div className="flex items-start gap-3">
        <Avatar initials={initials(card.contactName)} />

        <div className="min-w-0 flex-1">
          <Link
            href={`/leads/${card.id}`}
            draggable={false}
            className="block truncate text-sm font-medium text-tinta after:absolute after:inset-0 hover:text-musgo"
          >
            {leadTitle(card.title, card.eventType, card.contactName)}
          </Link>

          {/* O título derivado já traz o nome; só o repetimos quando há título próprio. */}
          {card.title && (
            <p className="truncate text-xs text-tinta-suave">{card.contactName}</p>
          )}

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            {card.eventType && <Chip label={card.eventType} />}
            <span className={`tabular text-xs ${vencido ? 'text-clay' : 'text-tinta-suave'}`}>
              {formatEventDate(card.eventDate)}
            </span>
          </div>

          {card.venue && (
            <p className="mt-1 truncate text-xs text-tinta-suave/80">{card.venue}</p>
          )}
        </div>
      </div>
    </article>
  )
}
