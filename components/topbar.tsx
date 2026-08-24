import Link from 'next/link'
import type { ReactNode } from 'react'

export function Topbar({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <header className="bg-floresta text-creme">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center gap-6 px-6">
        <Link href="/pipeline" className="shrink-0 leading-none">
          <span className="block font-display text-2xl font-semibold tracking-tight text-branco">
            HIERRO
          </span>
          <span className="mt-1 block text-[10px] font-medium tracking-[0.42em] text-creme/70">
            EVENTS
          </span>
        </Link>

        <span aria-hidden className="h-8 w-px bg-creme/20" />

        <h1 className="font-display text-xl italic text-creme">{title}</h1>

        <div className="ml-auto flex items-center gap-3">{actions}</div>
      </div>
    </header>
  )
}
