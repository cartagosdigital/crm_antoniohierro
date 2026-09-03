import { formatEventDate } from './format'
import type { Contact, Project } from '@/types/database'

// A língua é declarada aqui, e não importada de database.ts, porque o construtor
// não deve depender de a coluna ser um enum ou um text com check: ao regenerar os
// tipos a partir do schema real, só database.ts muda.
export type ProposalLanguage = 'pt' | 'en'

export const LANGUAGES: { value: ProposalLanguage; label: string }[] = [
  { value: 'pt', label: 'Português' },
  { value: 'en', label: 'English' },
]

export function isLanguage(value: unknown): value is ProposalLanguage {
  return value === 'pt' || value === 'en'
}

export type ProposalIntro = { eyebrow: string; heading: string; text: string }

export type ProposalGroup = { title: string; items: string[] }

export type ProposalPackage = {
  name: string
  tagline: string
  price: string
  priceNote: string
  groups: ProposalGroup[]
}

// couple e eventLine vazios caem para o valor derivado do lead — é isso que torna
// a capa "editável se for simples, senão derivada" sem duplicar o contacto.
// O kicker não deriva de nada: vem do conteúdo por defeito e traduz-se.
export type ProposalCover = { kicker: string; couple: string; eventLine: string }

export type ProposalSteps = { heading: string; text: string }

// Os campos fora de intro/packages existem porque o rascunho os traduz (têm
// data-pt/data-en) e portanto variam entre a proposta pt e a en. O lettering do
// rodapé e o contacto são fixos e ficam no componente, não aqui.
export type ProposalContent = {
  cover: ProposalCover
  intro: ProposalIntro
  packagesLabel: string
  packages: ProposalPackage[]
  steps: ProposalSteps
  footerNote: string
}

// ---------- leitura do jsonb ----------

// content chega como Json: pode estar vazio, vir de uma versão anterior da forma
// ou ter sido mexido à mão na consola. Em vez de rebentar no render, cada campo
// cai para um valor vazio e o construtor mostra-o como está.

function str(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function arr(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function obj(value: unknown): Record<string, unknown> {
  return (value ?? {}) as Record<string, unknown>
}

function parseGroup(raw: unknown): ProposalGroup {
  const o = obj(raw)
  return { title: str(o.title), items: arr(o.items).map(str) }
}

function parsePackage(raw: unknown): ProposalPackage {
  const o = obj(raw)
  return {
    name: str(o.name),
    tagline: str(o.tagline),
    price: str(o.price),
    priceNote: str(o.priceNote),
    groups: arr(o.groups).map(parseGroup),
  }
}

export function parseContent(raw: unknown): ProposalContent {
  const o = obj(raw)
  const cover = obj(o.cover)
  const intro = obj(o.intro)
  const steps = obj(o.steps)

  return {
    cover: {
      kicker: str(cover.kicker),
      couple: str(cover.couple),
      eventLine: str(cover.eventLine),
    },
    intro: {
      eyebrow: str(intro.eyebrow),
      heading: str(intro.heading),
      text: str(intro.text),
    },
    packagesLabel: str(o.packagesLabel),
    packages: arr(o.packages).map(parsePackage),
    steps: { heading: str(steps.heading), text: str(steps.text) },
    footerNote: str(o.footerNote),
  }
}

// ---------- capa ----------

// O brief prevê somar partner_name ao nome do contacto. A coluna não existe em
// contacts, portanto a capa deriva só o nome e fica ao editor acrescentar o par
// (o rascunho mostra "Marta & João"); quando a coluna existir, é aqui que entra.
export function capaDerivada(project: Project, contact: Contact): ProposalCover {
  const linha = [
    project.event_type,
    project.event_date ? formatEventDate(project.event_date) : null,
    project.venue,
  ].filter(Boolean)

  return { kicker: '', couple: contact.name ?? '', eventLine: linha.join(' · ') }
}

// O que sai impresso: o que foi escrito à mão, ou o derivado do lead.
export function capaFinal(content: ProposalContent, derivada: ProposalCover): ProposalCover {
  return {
    kicker: content.cover.kicker,
    couple: content.cover.couple.trim() || derivada.couple,
    eventLine: content.cover.eventLine.trim() || derivada.eventLine,
  }
}

// ---------- edição ----------

// Funções e não constantes: uma constante partilharia os arrays internos entre
// todos os pacotes criados a partir dela.
export function pacoteVazio(): ProposalPackage {
  return { name: '', tagline: '', price: '', priceNote: '', groups: [] }
}

export function grupoVazio(): ProposalGroup {
  return { title: '', items: [] }
}

// Reordenar pacotes; fora dos limites devolve a lista intacta.
export function mover<T>(lista: T[], de: number, para: number): T[] {
  if (para < 0 || para >= lista.length || de === para) return lista
  const copia = [...lista]
  const [item] = copia.splice(de, 1)
  copia.splice(para, 0, item)
  return copia
}

export function atualizarEm<T>(lista: T[], i: number, patch: Partial<T>): T[] {
  return lista.map((item, j) => (j === i ? { ...item, ...patch } : item))
}

export function removerEm<T>(lista: T[], i: number): T[] {
  return lista.filter((_, j) => j !== i)
}
