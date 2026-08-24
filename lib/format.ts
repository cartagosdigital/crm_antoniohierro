export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '—'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

// event_date vem como 'YYYY-MM-DD'; formatar sem passar por fuso horário.
export function formatEventDate(date: string | null) {
  if (!date) return 'sem data'
  const [year, month, day] = date.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

export function isPast(date: string | null, today: string) {
  return date !== null && date < today
}

// Totais do pipeline: euros redondos, sem cêntimos.
export function formatEuros(value: number) {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

// title é opcional; sem ele, deriva-se "tipo · nome do contacto".
export function leadTitle(
  title: string | null,
  eventType: string | null,
  contactName: string,
) {
  return title ?? `${eventType ?? 'Evento'} · ${contactName}`
}

// Há quanto tempo o lead está parado na etapa atual.
export function tempoDesde(iso: string) {
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (dias <= 0) return 'hoje'
  if (dias === 1) return 'há 1 dia'
  return `há ${dias} dias`
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}
