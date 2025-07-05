import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Export the basic client for direct use
export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
