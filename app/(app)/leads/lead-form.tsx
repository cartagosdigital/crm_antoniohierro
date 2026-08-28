'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { btnBrass, btnGhost, campo, cartao, rotulo } from '@/components/ui'
import { EVENT_TYPES, STAGES } from '@/lib/stages'
import type { LeadFormState } from './actions'
import type { Contact, Project } from '@/types/database'

type Lead = { project: Project; contact: Contact }

export function LeadForm({
  action,
  lead,
  submitLabel,
}: {
  action: (state: LeadFormState, formData: FormData) => Promise<LeadFormState>
  lead?: Lead
  submitLabel: string
}) {
  const [state, formAction] = useActionState(action, null)
  const p = lead?.project
  const c = lead?.contact

  return (
    <form action={formAction} className={`${cartao} space-y-6 p-6`}>
      {lead && (
        <>
          <input type="hidden" name="project_id" value={p!.id} />
          <input type="hidden" name="contact_id" value={c!.id} />
        </>
      )}

      <Seccao titulo="Contacto">
        <Campo label="Nome" name="name" defaultValue={c?.name ?? ''} required className="sm:col-span-2" />
        <Campo label="Email" name="email" type="email" defaultValue={c?.email ?? ''} />
        <Campo label="Telefone" name="phone" defaultValue={c?.phone ?? ''} />
        <Campo
          label="Origem"
          name="source"
          defaultValue={c?.source ?? ''}
          placeholder="indicação, instagram, site…"
          className="sm:col-span-2"
        />
      </Seccao>

      <Seccao titulo="Evento">
        <div className="space-y-1.5">
          <label htmlFor="event_type" className={rotulo}>
            Tipo
          </label>
          <input
            id="event_type"
            name="event_type"
            list="event-types"
            defaultValue={p?.event_type ?? ''}
            className={campo}
          />
          <datalist id="event-types">
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>

        <Campo label="Data" name="event_date" type="date" defaultValue={p?.event_date ?? ''} />
        <Campo label="Local" name="venue" defaultValue={p?.venue ?? ''} />
        <Campo
          label="Convidados"
          name="guest_count"
          type="number"
          min={0}
          defaultValue={p?.guest_count ?? ''}
        />

        <Campo
          label="Valor da proposta (€)"
          name="proposal_total"
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          defaultValue={p?.proposal_total ?? ''}
          className="sm:col-span-2"
        />

        <Campo
          label="Título"
          name="title"
          defaultValue={p?.title ?? ''}
          placeholder="Casamento · Maria Silva"
          hint="Opcional — se ficar vazio, é derivado do tipo e do nome do contacto."
          className="sm:col-span-2"
        />

        <div className="space-y-1.5">
          <label htmlFor="stage" className={rotulo}>
            Etapa
          </label>
          <select id="stage" name="stage" defaultValue={p?.stage ?? 'diagnostico'} className={campo}>
            {STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </Seccao>

      <div className="space-y-1.5">
        <label htmlFor="notes" className={rotulo}>
          Notas
        </label>
        <textarea id="notes" name="notes" rows={4} defaultValue={c?.notes ?? ''} className={campo} />
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-clay">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-pedra pt-5">
        <Link href="/pipeline" className={btnGhost}>
          Cancelar
        </Link>
        <Submit label={submitLabel} />
      </div>
    </form>
  )
}

function Seccao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="font-display text-base italic text-floresta">{titulo}</legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  )
}

function Campo({
  label,
  name,
  hint,
  className = '',
  ...props
}: {
  label: string
  name: string
  hint?: string
  className?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={name} className={rotulo}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-describedby={hint ? `${name}-hint` : undefined}
        className={campo}
        {...props}
      />
      {hint && (
        <p id={`${name}-hint`} className="text-xs text-tinta-suave">
          {hint}
        </p>
      )}
    </div>
  )
}

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={btnBrass}>
      {pending ? 'A guardar…' : label}
    </button>
  )
}
