'use client'

import { campo, rotulo } from '@/components/ui'
import {
  atualizarEm,
  removerEm,
  grupoVazio,
  type ProposalGroup,
  type ProposalPackage,
} from '@/lib/proposals'

const btnMini =
  'rounded-md border border-pedra-esc px-2 py-1 text-xs text-tinta-suave transition hover:bg-papel disabled:opacity-40'

const btnRemover = 'rounded-md px-2 py-1 text-xs text-clay transition hover:bg-clay/10'

function GrupoEditor({
  grupo,
  onChange,
  onRemover,
}: {
  grupo: ProposalGroup
  onChange: (patch: Partial<ProposalGroup>) => void
  onRemover: () => void
}) {
  return (
    <div className="space-y-2 rounded-md border border-pedra bg-papel p-3">
      <div className="flex items-center gap-2">
        <input
          aria-label="Título do grupo"
          value={grupo.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Título do grupo"
          className={campo}
        />
        <button type="button" onClick={onRemover} className={btnRemover}>
          Remover
        </button>
      </div>

      <ul className="space-y-1.5">
        {grupo.items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              aria-label={`Item ${i + 1}`}
              value={item}
              onChange={(e) => onChange({ items: grupo.items.map((v, j) => (j === i ? e.target.value : v)) })}
              className={campo}
            />
            <button
              type="button"
              onClick={() => onChange({ items: removerEm(grupo.items, i) })}
              className={btnRemover}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onChange({ items: [...grupo.items, ''] })}
        className={btnMini}
      >
        + Item
      </button>
    </div>
  )
}

export function PacoteEditor({
  pacote,
  indice,
  total,
  onChange,
  onRemover,
  onMover,
}: {
  pacote: ProposalPackage
  indice: number
  total: number
  onChange: (patch: Partial<ProposalPackage>) => void
  onRemover: () => void
  onMover: (para: number) => void
}) {
  return (
    <section className="space-y-3 rounded-lg border border-pedra bg-branco p-4">
      <header className="flex items-center gap-2">
        <h3 className="flex-1 text-xs font-medium uppercase tracking-wide text-tinta-suave">
          Pacote {indice + 1}
        </h3>
        <button
          type="button"
          onClick={() => onMover(indice - 1)}
          disabled={indice === 0}
          className={btnMini}
          aria-label="Mover para cima"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMover(indice + 1)}
          disabled={indice === total - 1}
          className={btnMini}
          aria-label="Mover para baixo"
        >
          ↓
        </button>
        <button type="button" onClick={onRemover} className={btnRemover}>
          Remover
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1.5 sm:col-span-2">
          <span className={rotulo}>Nome</span>
          <input
            value={pacote.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Gold · Planeamento Completo"
            className={campo}
          />
        </label>

        <label className="space-y-1.5 sm:col-span-2">
          <span className={rotulo}>Tagline</span>
          <input
            value={pacote.tagline}
            onChange={(e) => onChange({ tagline: e.target.value })}
            className={campo}
          />
        </label>

        <label className="space-y-1.5">
          <span className={rotulo}>Preço</span>
          <input
            value={pacote.price}
            onChange={(e) => onChange({ price: e.target.value })}
            placeholder="€ 3.500 ou Sob consulta"
            className={campo}
          />
        </label>

        <label className="space-y-1.5">
          <span className={rotulo}>Nota do preço</span>
          <input
            value={pacote.priceNote}
            onChange={(e) => onChange({ priceNote: e.target.value })}
            placeholder="+ IVA"
            className={campo}
          />
        </label>
      </div>

      <div className="space-y-2">
        {pacote.groups.map((grupo, i) => (
          <GrupoEditor
            key={i}
            grupo={grupo}
            onChange={(patch) => onChange({ groups: atualizarEm(pacote.groups, i, patch) })}
            onRemover={() => onChange({ groups: removerEm(pacote.groups, i) })}
          />
        ))}

        <button
          type="button"
          onClick={() => onChange({ groups: [...pacote.groups, grupoVazio()] })}
          className={btnMini}
        >
          + Grupo
        </button>
      </div>
    </section>
  )
}
