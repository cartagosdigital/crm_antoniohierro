import type { ProjectStage } from '@/types/database'

// Ordem do enum project_stage.
export const STAGES: { value: ProjectStage; label: string }[] = [
  { value: 'new_lead', label: 'Novo lead' },
  { value: 'contacted', label: 'Contactado' },
  { value: 'proposal_sent', label: 'Proposta enviada' },
  { value: 'negotiation', label: 'Negociação' },
  { value: 'won', label: 'Ganho' },
  { value: 'lost', label: 'Perdido' },
]

export const STAGE_VALUES = STAGES.map((s) => s.value)

export function isStage(value: unknown): value is ProjectStage {
  return typeof value === 'string' && STAGE_VALUES.includes(value as ProjectStage)
}

export function stageLabel(value: ProjectStage) {
  return STAGES.find((s) => s.value === value)?.label ?? value
}

// Tipos de evento sugeridos no formulário.
export const EVENT_TYPES = ['casamento', 'corporativo', 'aniversário', 'outro']
