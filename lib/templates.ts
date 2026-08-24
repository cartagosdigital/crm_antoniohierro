import type { MessageChannel } from '@/types/database'

export const CANAIS: { value: MessageChannel; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
]

export const CATEGORIAS = [
  { value: 'comercial', label: 'Comercial' },
  { value: 'operacao', label: 'Operação' },
]

export function isCanal(value: unknown): value is MessageChannel {
  return value === 'email' || value === 'whatsapp'
}

export function canalLabel(value: MessageChannel) {
  return value === 'email' ? 'Email' : 'WhatsApp'
}

export function categoriaLabel(value: string) {
  return CATEGORIAS.find((c) => c.value === value)?.label ?? value
}

// Telefone reduzido a dígitos para o wa.me.
export function digitos(phone: string | null) {
  return (phone ?? '').replace(/\D/g, '')
}
