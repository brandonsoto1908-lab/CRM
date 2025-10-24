import '../styles/globals.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

function useAuthCheck() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        if (router.pathname !== '/login') router.replace('/login')
      }
    })

    // Don't check on login page
    if (router.pathname === '/login') {
      setLoading(false)
      return () => subscription?.unsubscribe()
    }

    // Check session on mount and after route changes
    fetch('/api/me').then(async (r) => {
      if (r.status === 200) {
        setLoading(false)
      } else {
        if (router.pathname !== '/login') router.replace('/login')
      }
    }).catch(() => {
      if (router.pathname !== '/login') router.replace('/login')
    })

    return () => subscription?.unsubscribe()
  }, [router])

  return loading
}

export default function App({ Component, pageProps }) {
  const loading = useAuthCheck()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4">Comprobando sesión...</div>
          <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return <Component {...pageProps} />
}
