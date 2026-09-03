import Link from 'next/link'
import { btnBrass, campo, cartao, rotulo } from '@/components/ui'
import { LANGUAGES, type ProposalLanguage } from '@/lib/proposals'
import { gerarProposta } from './actions'

type Existente = { id: string; language: ProposalLanguage }

function nomeLingua(language: ProposalLanguage) {
  return LANGUAGES.find((l) => l.value === language)?.label ?? language
}

export function GerarProposta({
  projectId,
  existentes,
}: {
  projectId: string
  existentes: Existente[]
}) {
  // Só as línguas por criar entram no seletor; as que já têm proposta abrem-se
  // pela lista, para o botão nunca sugerir uma acção que apenas reabre.
  const porCriar = LANGUAGES.filter((l) => !existentes.some((e) => e.language === l.value))

  return (
    <section className={`${cartao} space-y-4 p-5`}>
      <h2 className="font-display text-base font-semibold text-floresta">Proposta</h2>

      {existentes.length > 0 && (
        <ul className="space-y-2">
          {existentes.map((proposta) => (
            <li key={proposta.id}>
              <Link
                href={`/proposals/${proposta.id}`}
                className="flex items-center justify-between rounded-md border border-pedra px-3 py-2 text-sm transition hover:border-pedra-esc hover:bg-papel"
              >
                <span className="text-tinta">{nomeLingua(proposta.language)}</span>
                <span className="text-xs text-tinta-suave">Abrir construtor</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {porCriar.length > 0 ? (
        <form action={gerarProposta} className="flex items-end gap-3">
          <input type="hidden" name="project_id" value={projectId} />

          <div className="flex-1 space-y-1.5">
            <label htmlFor="language" className={rotulo}>
              Língua
            </label>
            <select id="language" name="language" className={campo}>
              {porCriar.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className={btnBrass}>
            Gerar proposta
          </button>
        </form>
      ) : (
        <p className="text-xs text-tinta-suave">
          Este lead já tem proposta nas duas línguas.
        </p>
      )}
    </section>
  )
}
