import Link from 'next/link'
import { Topbar } from '@/components/topbar'
import { Chip, SeloCanal, btnBrass, btnGhost, btnGhostClaro, cartao } from '@/components/ui'
import { createClient } from '@/lib/supabase/server'
import { stageLabel } from '@/lib/stages'
import { CANAIS, CATEGORIAS, isCanal } from '@/lib/templates'
import { duplicateTemplate } from './actions'

export const metadata = { title: 'Templates · Hierro Events' }

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ canal?: string; categoria?: string }>
}) {
  const { canal, categoria } = await searchParams
  const canalAtivo = isCanal(canal) ? canal : null
  const categoriaAtiva = CATEGORIAS.some((c) => c.value === categoria) ? categoria! : null

  const supabase = await createClient()
  const { data: templates, error } = await supabase
    .from('message_templates')
    .select('*')
    .order('name')

  const todos = templates ?? []
  const visiveis = todos.filter(
    (t) =>
      (!canalAtivo || t.channel === canalAtivo) &&
      (!categoriaAtiva || t.category === categoriaAtiva),
  )

  return (
    <>
      <Topbar
        title="Templates"
        actions={
          <>
            <Link href="/pipeline" className={btnGhostClaro}>
              Pipeline
            </Link>
            <Link href="/templates/new" className={btnBrass}>
              Novo template
            </Link>
          </>
        }
      />

      <main className="mx-auto flex w-full max-w-[1600px] flex-1 gap-6 px-6 py-6">
        <nav className="w-52 shrink-0 space-y-1">
          <RailLink
            href={hrefCom({ canal: canalAtivo, categoria: null })}
            label="Todas"
            count={todos.filter((t) => !canalAtivo || t.channel === canalAtivo).length}
            ativo={categoriaAtiva === null}
          />
          {CATEGORIAS.map((c) => (
            <RailLink
              key={c.value}
              href={hrefCom({ canal: canalAtivo, categoria: c.value })}
              label={c.label}
              count={
                todos.filter(
                  (t) => t.category === c.value && (!canalAtivo || t.channel === canalAtivo),
                ).length
              }
              ativo={categoriaAtiva === c.value}
            />
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-center gap-2">
            <FiltroCanal
              href={hrefCom({ canal: null, categoria: categoriaAtiva })}
              label="Todos"
              ativo={canalAtivo === null}
            />
            {CANAIS.map((c) => (
              <FiltroCanal
                key={c.value}
                href={hrefCom({ canal: c.value, categoria: categoriaAtiva })}
                label={c.label}
                ativo={canalAtivo === c.value}
              />
            ))}
          </div>

          {error ? (
            <p role="alert" className="text-sm text-clay">
              Não foi possível carregar os templates.
            </p>
          ) : visiveis.length === 0 ? (
            <p className="rounded-lg border border-dashed border-pedra-esc px-4 py-12 text-center text-sm text-tinta-suave">
              Ainda não há templates aqui.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visiveis.map((t) => (
                <article key={t.id} className={`${cartao} flex flex-col p-4`}>
                  <div className="flex items-start gap-2">
                    <h2 className="min-w-0 flex-1 text-sm font-medium text-tinta">{t.name}</h2>
                    <SeloCanal channel={t.channel} />
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wide text-tinta-suave">
                      {CATEGORIAS.find((c) => c.value === t.category)?.label ?? t.category}
                    </span>
                    {t.stage && <Chip label={stageLabel(t.stage)} />}
                  </div>

                  <p className="mt-3 line-clamp-4 flex-1 text-xs leading-relaxed text-tinta-suave">
                    {t.body}
                  </p>

                  <div className="mt-4 flex items-center gap-2 border-t border-pedra pt-3">
                    <Link href={`/templates/${t.id}`} className={`${btnGhost} px-3 py-1.5`}>
                      Editar
                    </Link>
                    <form action={duplicateTemplate}>
                      <input type="hidden" name="id" value={t.id} />
                      <button type="submit" className={`${btnGhost} px-3 py-1.5`}>
                        Duplicar
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}

function hrefCom({ canal, categoria }: { canal: string | null; categoria: string | null }) {
  const params = new URLSearchParams()
  if (canal) params.set('canal', canal)
  if (categoria) params.set('categoria', categoria)
  const query = params.toString()
  return query ? `/templates?${query}` : '/templates'
}

function RailLink({
  href,
  label,
  count,
  ativo,
}: {
  href: string
  label: string
  count: number
  ativo: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={ativo ? 'page' : undefined}
      className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition ${
        ativo ? 'bg-floresta text-creme' : 'text-tinta-suave hover:bg-papel'
      }`}
    >
      {label}
      <span className={`tabular text-xs ${ativo ? 'text-creme/70' : 'text-tinta-suave/70'}`}>
        {count}
      </span>
    </Link>
  )
}

function FiltroCanal({ href, label, ativo }: { href: string; label: string; ativo: boolean }) {
  return (
    <Link
      href={href}
      aria-current={ativo ? 'page' : undefined}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        ativo
          ? 'bg-floresta text-creme'
          : 'border border-pedra-esc text-tinta-suave hover:bg-papel'
      }`}
    >
      {label}
    </Link>
  )
}
