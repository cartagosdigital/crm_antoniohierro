'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { btnBrass, btnGhost, campo, cartao, rotulo } from '@/components/ui'
import { CAMPOS_MERGE } from '@/lib/merge'
import { STAGES } from '@/lib/stages'
import { CANAIS, CATEGORIAS } from '@/lib/templates'
import type { TemplateFormState } from './actions'
import type { MessageChannel, MessageTemplate } from '@/types/database'

export function TemplateForm({
  action,
  template,
  submitLabel,
}: {
  action: (state: TemplateFormState, formData: FormData) => Promise<TemplateFormState>
  template?: MessageTemplate
  submitLabel: string
}) {
  const [state, formAction] = useActionState(action, null)
  const [channel, setChannel] = useState<MessageChannel>(template?.channel ?? 'email')

  return (
    <form action={formAction} className={`${cartao} space-y-6 p-6`}>
      {template && <input type="hidden" name="id" value={template.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="name" className={rotulo}>
            Nome
          </label>
          <input
            id="name"
            name="name"
            defaultValue={template?.name ?? ''}
            required
            className={campo}
            placeholder="Proposta enviada — seguimento"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="channel" className={rotulo}>
            Canal
          </label>
          <select
            id="channel"
            name="channel"
            value={channel}
            onChange={(e) => setChannel(e.target.value as MessageChannel)}
            className={campo}
          >
            {CANAIS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="category" className={rotulo}>
            Categoria
          </label>
          <select
            id="category"
            name="category"
            defaultValue={template?.category ?? 'comercial'}
            className={campo}
          >
            {CATEGORIAS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {channel === 'email' && (
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="subject" className={rotulo}>
              Assunto
            </label>
            <input
              id="subject"
              name="subject"
              defaultValue={template?.subject ?? ''}
              className={campo}
              placeholder="A sua proposta para {tipo}"
            />
          </div>
        )}

        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="stage" className={rotulo}>
            Etapa sugerida
          </label>
          <select
            id="stage"
            name="stage"
            defaultValue={template?.stage ?? ''}
            className={campo}
          >
            <option value="">Nenhuma</option>
            {STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="body" className={rotulo}>
          Corpo
        </label>
        <textarea
          id="body"
          name="body"
          rows={10}
          defaultValue={template?.body ?? ''}
          required
          aria-describedby="merge-hint"
          className={`${campo} font-mono text-[13px] leading-relaxed`}
        />
        <p id="merge-hint" className="text-xs text-tinta-suave">
          Campos preenchidos no envio:{' '}
          {CAMPOS_MERGE.map((c, i) => (
            <span key={c}>
              {i > 0 && ', '}
              <code className="rounded bg-papel px-1 py-0.5 text-latao">{c}</code>
            </span>
          ))}
        </p>
      </div>

      {state?.error && (
        <p role="alert" className="text-sm text-clay">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-pedra pt-5">
        <Link href="/templates" className={btnGhost}>
          Cancelar
        </Link>
        <Submit label={submitLabel} />
      </div>
    </form>
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
