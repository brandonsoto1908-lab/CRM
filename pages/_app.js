import '../styles/globals.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import Layout from '../components/Layout'

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
  const router = useRouter()
  const loading = useAuthCheck()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="mb-4 text-gray-700 font-medium">Comprobando sesión...</div>
          <div className="w-12 h-12 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  // Don't use Layout for login page
  if (router.pathname === '/login') {
    return <Component {...pageProps} />
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
