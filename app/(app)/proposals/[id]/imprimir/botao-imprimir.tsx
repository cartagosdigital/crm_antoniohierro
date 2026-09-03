'use client'

import Link from 'next/link'
import { btnBrass, btnGhost } from '@/components/ui'

// Barra flutuante do ecrã; sai do PDF pela regra .nao-imprimir.
export function BarraImpressao({ voltarPara }: { voltarPara: string }) {
  return (
    <div className="nao-imprimir fixed inset-x-0 bottom-0 z-10 flex items-center justify-center gap-3 border-t border-pedra bg-branco/95 px-6 py-3 backdrop-blur">
      <Link href={voltarPara} className={btnGhost}>
        Voltar ao construtor
      </Link>
      <button type="button" onClick={() => window.print()} className={btnBrass}>
        Guardar PDF
      </button>
      <span className="text-xs text-tinta-suave">
        Na caixa de impressão, escolher &ldquo;Guardar como PDF&rdquo; e margens
        &ldquo;Nenhumas&rdquo;.
      </span>
    </div>
  )
}
