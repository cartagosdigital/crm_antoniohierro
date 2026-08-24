import { formatEventDate } from './format'
import type { Contact, Project } from '@/types/database'

// Mostrados na nota do formulário e substituídos na pré-visualização.
export const CAMPOS_MERGE = ['{cliente}', '{data}', '{local}', '{tipo}', '{convidados}'] as const

export type DadosMerge = {
  cliente: string | null
  data: string | null
  local: string | null
  tipo: string | null
  convidados: number | null
}

export function dadosMerge(project: Project, contact: Contact): DadosMerge {
  return {
    cliente: contact.name,
    data: project.event_date,
    local: project.venue,
    tipo: project.event_type,
    convidados: project.guest_count,
  }
}

// Um campo sem valor sai como texto vazio — melhor um espaço a menos na
// mensagem do que um "{local}" por preencher a chegar ao cliente.
export function aplicarMerge(texto: string, dados: DadosMerge) {
  const valores: Record<string, string> = {
    '{cliente}': dados.cliente ?? '',
    '{data}': dados.data ? formatEventDate(dados.data) : '',
    '{local}': dados.local ?? '',
    '{tipo}': dados.tipo ?? '',
    '{convidados}': dados.convidados === null ? '' : String(dados.convidados),
  }
  return texto.replace(/\{(?:cliente|data|local|tipo|convidados)\}/g, (m) => valores[m] ?? m)
}
