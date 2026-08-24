import { createBrowserClient } from '@supabase/ssr'
import { supabaseEnv } from './env'
import type { Database } from '@/types/database'

export function createClient() {
  const { url, key } = supabaseEnv()
  return createBrowserClient<Database>(url, key)
}
