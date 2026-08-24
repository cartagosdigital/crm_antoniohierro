import { cartao } from '@/components/ui'
import { LoginForm } from './login-form'

export const metadata = { title: 'Entrar · Hierro Events' }

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center leading-none">
          <span className="block font-display text-4xl font-semibold tracking-tight text-floresta">
            HIERRO
          </span>
          <span className="mt-2 block text-[11px] font-medium tracking-[0.42em] text-tinta-suave">
            EVENTS
          </span>
        </div>

        <div className={`${cartao} p-6`}>
          <h1 className="mb-6 font-display text-lg italic text-floresta">Entrar no CRM</h1>
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-tinta-suave">
          As contas são criadas pelo administrador.
        </p>
      </div>
    </main>
  )
}
