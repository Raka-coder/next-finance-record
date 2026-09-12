import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/databases/database.types'

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

  if (typeof window !== 'undefined' && browserClient) {
    return browserClient
  }

  const client = createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  )

  if (typeof window !== 'undefined') {
    browserClient = client
  }

  return client
}

// Backward-compatible export getter
export const supabase = typeof window !== 'undefined' ? createClient() : ({} as ReturnType<typeof createBrowserClient<Database>>)

