// Vocabulário visual partilhado: botões, cartão e chips.

// Ação principal — brass sólido, texto escuro. Só sobre superfícies claras ou verde.
export const btnBrass =
  'inline-flex items-center justify-center gap-2 rounded-md bg-latao px-4 py-2 text-sm font-medium text-tinta transition hover:bg-latao-cl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-latao-cl disabled:opacity-60'

// Secundária sobre verde — fantasma com borda clara.
export const btnGhostClaro =
  'inline-flex items-center justify-center gap-2 rounded-md border border-creme/40 px-4 py-2 text-sm font-medium text-creme transition hover:bg-creme/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-creme disabled:opacity-60'

// Secundária sobre fundo claro.
export const btnGhost =
  'inline-flex items-center justify-center gap-2 rounded-md border border-pedra-esc px-4 py-2 text-sm font-medium text-tinta-suave transition hover:bg-papel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-latao disabled:opacity-60'

export const cartao =
  'rounded-lg border border-pedra bg-branco shadow-cartao'

export const campo =
  'w-full rounded-md border border-pedra bg-branco px-3 py-2 text-sm text-tinta placeholder:text-tinta-suave/60 focus:border-musgo focus:outline-none'

export const rotulo = 'block text-xs font-medium uppercase tracking-wide text-tinta-suave'

const TONS: Record<string, string> = {
  casamento: 'bg-musgo/12 text-musgo',
  corporativo: 'bg-slate-500/12 text-slate-600',
}

export function Chip({ label }: { label: string }) {
  const tom = TONS[label.toLowerCase()] ?? 'bg-pedra/50 text-tinta-suave'
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${tom}`}
    >
      {label}
    </span>
  )
}

export function Avatar({ initials }: { initials: string }) {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-floresta text-[11px] font-medium tracking-wide text-creme">
      {initials}
    </span>
  )
}
