'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { btnBrass, btnGhost, campo, rotulo } from '@/components/ui'
import {
  atualizarEm,
  capaFinal,
  mover,
  pacoteVazio,
  removerEm,
  LANGUAGES,
  type ProposalContent,
  type ProposalCover,
  type ProposalLanguage,
  type ProposalSteps,
} from '@/lib/proposals'
import { gerarProposta, guardarProposta } from '../actions'
import { Documento } from './documento'
import { PacoteEditor } from './pacotes-editor'

// A pré-visualização usa zoom e não transform: scale porque o zoom encolhe
// também a caixa no fluxo, e a coluna fica com a altura do que se vê.
const ESCALA = 0.42

export function Builder({
  id,
  projectId,
  language,
  inicial,
  derivada,
}: {
  id: string
  projectId: string
  language: ProposalLanguage
  inicial: ProposalContent
  derivada: ProposalCover
}) {
  const router = useRouter()
  const [content, setContent] = useState(inicial)
  const [referencia, setReferencia] = useState(() => JSON.stringify(inicial))
  const [erro, setErro] = useState<string | null>(null)
  const [aGuardar, startTransition] = useTransition()

  const sujo = JSON.stringify(content) !== referencia

  function guardar(depois?: () => void) {
    startTransition(async () => {
      const resultado = await guardarProposta(id, content)
      if (resultado && 'error' in resultado) {
        setErro(resultado.error)
        return
      }
      setErro(null)
      setReferencia(JSON.stringify(content))
      depois?.()
    })
  }

  // A rota de impressão lê da base de dados, portanto o que não estiver
  // guardado não sairia no PDF: guarda-se primeiro e só depois se navega.
  function exportar() {
    if (!sujo) {
      router.push(`/proposals/${id}/imprimir`)
      return
    }
    guardar(() => router.push(`/proposals/${id}/imprimir`))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
      <div className="space-y-5">
        <Barra
          projectId={projectId}
          language={language}
          sujo={sujo}
          aGuardar={aGuardar}
          onGuardar={() => guardar()}
          onExportar={exportar}
        />

        {erro && (
          <p role="alert" className="text-sm text-clay">
            {erro}
          </p>
        )}

        <Capa
          cover={content.cover}
          derivada={derivada}
          onChange={(patch) => setContent((c) => ({ ...c, cover: { ...c.cover, ...patch } }))}
        />

        <Intro
          intro={content.intro}
          onChange={(patch) => setContent((c) => ({ ...c, intro: { ...c.intro, ...patch } }))}
        />

        <section className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-base font-semibold text-floresta">Pacotes</h2>
            <label className="space-y-1.5">
              <span className={rotulo}>Rótulo da secção</span>
              <input
                value={content.packagesLabel}
                onChange={(e) => setContent((c) => ({ ...c, packagesLabel: e.target.value }))}
                className={campo}
              />
            </label>
          </div>

          {content.packages.map((pacote, i) => (
            <PacoteEditor
              key={i}
              pacote={pacote}
              indice={i}
              total={content.packages.length}
              onChange={(patch) =>
                setContent((c) => ({ ...c, packages: atualizarEm(c.packages, i, patch) }))
              }
              onRemover={() => setContent((c) => ({ ...c, packages: removerEm(c.packages, i) }))}
              onMover={(para) => setContent((c) => ({ ...c, packages: mover(c.packages, i, para) }))}
            />
          ))}

          <button
            type="button"
            onClick={() => setContent((c) => ({ ...c, packages: [...c.packages, pacoteVazio()] }))}
            className={btnGhost}
          >
            + Pacote
          </button>
        </section>

        <Fecho
          steps={content.steps}
          footerNote={content.footerNote}
          onSteps={(patch) => setContent((c) => ({ ...c, steps: { ...c.steps, ...patch } }))}
          onFooterNote={(footerNote) => setContent((c) => ({ ...c, footerNote }))}
        />
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-6 space-y-2">
          <p className={rotulo}>Pré-visualização</p>
          <div className="max-h-[80vh] overflow-y-auto rounded-lg border border-pedra bg-pedra/40 p-3">
            <div style={{ zoom: ESCALA }}>
              <Documento cover={capaFinal(content, derivada)} content={content} />
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

function Barra({
  projectId,
  language,
  sujo,
  aGuardar,
  onGuardar,
  onExportar,
}: {
  projectId: string
  language: ProposalLanguage
  sujo: boolean
  aGuardar: boolean
  onGuardar: () => void
  onExportar: () => void
}) {
  const atual = LANGUAGES.find((l) => l.value === language)
  const outra = LANGUAGES.find((l) => l.value !== language)

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-pedra bg-branco p-3">
      <span className="text-xs text-tinta-suave">
        Língua: <span className="font-medium text-tinta">{atual?.label}</span>
      </span>

      {/* Trocar de língua abre a proposta da outra língua — não traduz esta. */}
      {outra && (
        <form action={gerarProposta}>
          <input type="hidden" name="project_id" value={projectId} />
          <input type="hidden" name="language" value={outra.value} />
          <button type="submit" className="text-xs text-musgo underline-offset-2 hover:underline">
            Abrir em {outra.label}
          </button>
        </form>
      )}

      <span className="ml-auto text-xs text-tinta-suave">
        {aGuardar ? 'A guardar…' : sujo ? 'Alterações por guardar' : 'Guardado'}
      </span>

      <button type="button" onClick={onGuardar} disabled={!sujo || aGuardar} className={btnGhost}>
        Guardar
      </button>

      <button type="button" onClick={onExportar} disabled={aGuardar} className={btnBrass}>
        Pré-visualizar e exportar PDF
      </button>
    </div>
  )
}

function Capa({
  cover,
  derivada,
  onChange,
}: {
  cover: ProposalCover
  derivada: ProposalCover
  onChange: (patch: Partial<ProposalCover>) => void
}) {
  return (
    <section className="space-y-3 rounded-lg border border-pedra bg-branco p-4">
      <h2 className="font-display text-base font-semibold text-floresta">Capa</h2>
      <p className="text-xs text-tinta-suave">
        Casal e linha do evento, em branco, saem do lead.
      </p>

      <label className="block space-y-1.5">
        <span className={rotulo}>Sobretítulo</span>
        <input
          value={cover.kicker}
          onChange={(e) => onChange({ kicker: e.target.value })}
          className={campo}
        />
      </label>

      <label className="block space-y-1.5">
        <span className={rotulo}>Casal</span>
        <input
          value={cover.couple}
          onChange={(e) => onChange({ couple: e.target.value })}
          placeholder={derivada.couple || 'Nome do contacto'}
          className={campo}
        />
      </label>

      <label className="block space-y-1.5">
        <span className={rotulo}>Linha do evento</span>
        <input
          value={cover.eventLine}
          onChange={(e) => onChange({ eventLine: e.target.value })}
          placeholder={derivada.eventLine || 'Tipo · data · local'}
          className={campo}
        />
      </label>
    </section>
  )
}

function Intro({
  intro,
  onChange,
}: {
  intro: ProposalContent['intro']
  onChange: (patch: Partial<ProposalContent['intro']>) => void
}) {
  return (
    <section className="space-y-3 rounded-lg border border-pedra bg-branco p-4">
      <h2 className="font-display text-base font-semibold text-floresta">Introdução</h2>

      <label className="block space-y-1.5">
        <span className={rotulo}>Sobretítulo</span>
        <input
          value={intro.eyebrow}
          onChange={(e) => onChange({ eyebrow: e.target.value })}
          className={campo}
        />
      </label>

      <label className="block space-y-1.5">
        <span className={rotulo}>Título</span>
        <input
          value={intro.heading}
          onChange={(e) => onChange({ heading: e.target.value })}
          className={campo}
        />
      </label>

      <label className="block space-y-1.5">
        <span className={rotulo}>Texto</span>
        <textarea
          value={intro.text}
          onChange={(e) => onChange({ text: e.target.value })}
          rows={4}
          className={campo}
        />
      </label>
    </section>
  )
}

function Fecho({
  steps,
  footerNote,
  onSteps,
  onFooterNote,
}: {
  steps: ProposalSteps
  footerNote: string
  onSteps: (patch: Partial<ProposalSteps>) => void
  onFooterNote: (value: string) => void
}) {
  return (
    <section className="space-y-3 rounded-lg border border-pedra bg-branco p-4">
      <h2 className="font-display text-base font-semibold text-floresta">Fecho</h2>

      <label className="block space-y-1.5">
        <span className={rotulo}>Título dos próximos passos</span>
        <input
          value={steps.heading}
          onChange={(e) => onSteps({ heading: e.target.value })}
          className={campo}
        />
      </label>

      <label className="block space-y-1.5">
        <span className={rotulo}>Próximos passos</span>
        <textarea
          value={steps.text}
          onChange={(e) => onSteps({ text: e.target.value })}
          rows={3}
          className={campo}
        />
      </label>

      <label className="block space-y-1.5">
        <span className={rotulo}>Nota do rodapé</span>
        <input
          value={footerNote}
          onChange={(e) => onFooterNote(e.target.value)}
          className={campo}
        />
      </label>
    </section>
  )
}
