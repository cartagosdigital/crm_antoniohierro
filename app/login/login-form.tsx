'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { signIn } from './actions'
import { btnBrass, campo, rotulo } from '@/components/ui'

export function LoginForm() {
  const [error, action] = useActionState(signIn, null)

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="email" className={rotulo}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={campo}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className={rotulo}>
          Senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={campo}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-clay">
          {error}
        </p>
      )}

      <Submit />
    </form>
  )
}

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className={`${btnBrass} w-full`}>
      {pending ? 'A entrar…' : 'Entrar'}
    </button>
  )
}
