import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { supabaseEnv } from '@/lib/supabase/env'

// Renova a sessão do Supabase a cada pedido e protege as rotas do app.
// (No Next.js 16 o middleware chama-se proxy.)
export async function proxy(request: NextRequest) {
  const { url, key } = supabaseEnv()
  let response = NextResponse.next({ request })

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value)
        }
        response = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isLogin = pathname === '/login'

  if (!user && !isLogin) return redirectTo('/login', request, response)
  if (user && isLogin) return redirectTo('/pipeline', request, response)

  return response
}

// Mantém os cookies renovados ao redirecionar.
function redirectTo(pathname: string, request: NextRequest, from: NextResponse) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = ''

  const response = NextResponse.redirect(url)
  for (const cookie of from.cookies.getAll()) {
    response.cookies.set(cookie)
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
