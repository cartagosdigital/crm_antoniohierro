import { carregarProposta } from '../carregar'
import { Documento } from '../documento'
import { BarraImpressao } from './botao-imprimir'

export const metadata = { title: 'Proposta · Hierro Events' }

// Rota só com o documento: sem barra de topo nem cromagem, para o que se vê no
// ecrã ser exactamente o que a impressão gera.
export default async function ImprimirPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { cover, content } = await carregarProposta(id)

  return (
    <main className="min-h-screen bg-pedra/40 px-4 pb-28 pt-8 print:bg-branco print:p-0">
      <Documento cover={cover} content={content} />
      <BarraImpressao voltarPara={`/proposals/${id}`} />
    </main>
  )
}
