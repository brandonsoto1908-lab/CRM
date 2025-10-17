import { createClient } from '@supabase/supabase-js'

// Client-side Supabase instance (safe to bundle).
// Use NEXT_PUBLIC_... env vars which Vercel will expose to the browser when configured.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Do not throw here to allow non-browser usage in server code that imports this file
  // (server routes should import the server client). Log a helpful message.
  console.warn('Warning: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
