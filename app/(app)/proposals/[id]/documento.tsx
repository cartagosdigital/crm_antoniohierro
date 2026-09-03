import type { ProposalContent, ProposalCover, ProposalPackage } from '@/lib/proposals'
import './documento.css'

// Espelha reference/proposta.html: a mesma árvore, as mesmas classes, o CSS
// portado em documento.css. Sem hooks nem estado, para servir tanto a
// pré-visualização do construtor como a rota de impressão — o que se vê no
// ecrã e o que sai no PDF são o mesmo componente.

// Fixos porque o rascunho não os traduz (não têm data-pt/data-en): são marca,
// não conteúdo da proposta.
const MARCA = 'ANTÓNIO HIERRO'
const CONTACTO = 'events@antoniohierro.com · Porto'

function Capa({ cover }: { cover: ProposalCover }) {
  return (
    <div className="page">
      <div className="cover">
        {/* eslint-disable-next-line @next/next/no-img-element -- o next/image
            não serve aqui: a página é impressa, e o optimizer devolve um srcset
            que o motor de impressão não resolve à resolução certa. */}
        <img src="/logo-hierro.png" alt="António Hierro Event Planner" />
        <div className="rule" />
        {cover.kicker && <div className="kicker">{cover.kicker}</div>}
        {cover.couple && <div className="couple">{cover.couple}</div>}
        {cover.eventLine && <div className="event">{cover.eventLine}</div>}
      </div>
    </div>
  )
}

function Pacote({ pacote }: { pacote: ProposalPackage }) {
  return (
    <div className="pack">
      <div className="pack-head">
        <div>
          {pacote.name && <div className="pk-name">{pacote.name}</div>}
          {pacote.tagline && <div className="pk-tag">{pacote.tagline}</div>}
        </div>

        {pacote.price && (
          <div className="pk-price">
            <div className="v">{pacote.price}</div>
            {pacote.priceNote && <div className="n">{pacote.priceNote}</div>}
          </div>
        )}
      </div>

      {pacote.groups.length > 0 && (
        <div className="pack-body">
          {pacote.groups.map((grupo, i) => (
            <div key={i} className="grp">
              {grupo.title && <h4>{grupo.title}</h4>}
              <ul>
                {grupo.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Documento({
  cover,
  content,
}: {
  cover: ProposalCover
  content: ProposalContent
}) {
  return (
    <div className="documento">
      <Capa cover={cover} />

      <div className="page">
        <div className="body">
          <div className="intro">
            {content.intro.eyebrow && <div className="eyebrow">{content.intro.eyebrow}</div>}
            {content.intro.heading && <h2>{content.intro.heading}</h2>}
            {content.intro.text && <p>{content.intro.text}</p>}
          </div>

          {content.packagesLabel && (
            <div className="sep">
              <span>{content.packagesLabel}</span>
            </div>
          )}

          {content.packages.map((pacote, i) => (
            <Pacote key={i} pacote={pacote} />
          ))}

          {(content.steps.heading || content.steps.text) && (
            <div className="steps">
              {content.steps.heading && <h3>{content.steps.heading}</h3>}
              {content.steps.text && <p>{content.steps.text}</p>}
            </div>
          )}

          <div className="foot">
            <div className="fw">{MARCA}</div>
            <div className="fmeta">
              {content.footerNote && (
                <>
                  <span>{content.footerNote}</span>
                  <br />
                </>
              )}
              {CONTACTO}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
