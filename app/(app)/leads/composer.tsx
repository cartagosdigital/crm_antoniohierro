'use client'

import { useMemo, useState } from 'react'
import { SeloCanal, btnBrass, campo, cartao, rotulo } from '@/components/ui'
import { aplicarMerge, type DadosMerge } from '@/lib/merge'
import { CANAIS, digitos } from '@/lib/templates'
import type { MessageChannel, MessageTemplate } from '@/types/database'

type Destino = { email: string | null; phone: string | null }

export function Composer({
  templates,
  dados,
  destino,
}: {
  templates: MessageTemplate[]
  dados: DadosMerge
  destino: Destino
}) {
  const [channel, setChannel] = useState<MessageChannel>('email')
  const [templateId, setTemplateId] = useState('')

  const doCanal = useMemo(
    () => templates.filter((t) => t.channel === channel),
    [templates, channel],
  )
  const template = doCanal.find((t) => t.id === templateId) ?? null

  const assunto = template?.subject ? aplicarMerge(template.subject, dados) : ''
  const corpo = template ? aplicarMerge(template.body, dados) : ''

  const telefone = digitos(destino.phone)
  const href =
    channel === 'whatsapp'
      ? `https://wa.me/${telefone}?text=${encodeURIComponent(corpo)}`
      : `mailto:${destino.email ?? ''}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`

  const falta =
    channel === 'whatsapp'
      ? !telefone && 'O contacto não tem telefone.'
      : !destino.email && 'O contacto não tem email.'

  return (
    <section className={`${cartao} space-y-4 p-6`}>
      <h2 className="font-display text-base italic text-floresta">Enviar mensagem</h2>

      <div className="flex gap-2">
        {CANAIS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => {
              setChannel(c.value)
              setTemplateId('')
            }}
            aria-pressed={channel === c.value}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              channel === c.value
                ? 'bg-floresta text-creme'
                : 'border border-pedra-esc text-tinta-suave hover:bg-papel'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="template" className={rotulo}>
          Template
        </label>
        <select
          id="template"
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          className={campo}
        >
          <option value="">Escolher template…</option>
          {doCanal.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        {doCanal.length === 0 && (
          <p className="text-xs text-tinta-suave">
            Não há templates comerciais de {channel === 'email' ? 'email' : 'WhatsApp'}.
          </p>
        )}
      </div>

      {template && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={rotulo}>Pré-visualização</span>
            <SeloCanal channel={channel} />
          </div>

          {channel === 'email' ? (
            <div className="rounded-md border border-pedra bg-papel">
              <p className="border-b border-pedra px-4 py-2 text-sm font-medium text-tinta">
                {assunto || <span className="text-tinta-suave">(sem assunto)</span>}
              </p>
              <p className="whitespace-pre-wrap px-4 py-3 text-sm leading-relaxed text-tinta">
                {corpo}
              </p>
            </div>
          ) : (
            <div className="rounded-md bg-papel p-4">
              <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-musgo/12 px-4 py-3 text-sm leading-relaxed text-tinta">
                {corpo}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-pedra pt-4">
        {falta && <p className="mr-auto text-xs text-clay">{falta}</p>}
        {template && !falta ? (
          <a
            href={href}
            target={channel === 'whatsapp' ? '_blank' : undefined}
            rel={channel === 'whatsapp' ? 'noreferrer' : undefined}
            className={btnBrass}
          >
            {channel === 'whatsapp' ? 'Abrir no WhatsApp' : 'Abrir no email'}
          </a>
        ) : (
          <span className={`${btnBrass} pointer-events-none opacity-50`} aria-disabled>
            {channel === 'whatsapp' ? 'Abrir no WhatsApp' : 'Abrir no email'}
          </span>
        )}
      </div>
    </section>
  )
}
