import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Accept username and transform to email if needed
  function toEmail(input) {
    if (!input) return ''
    return input.includes('@') ? input : `${input}@example.com`
  }

  async function submit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Sign in with Supabase
      const emailToUse = toEmail(email.trim())
      console.log('Intentando login con:', { email: emailToUse })
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password
      })

      if (signInError) {
        console.error('Error Supabase:', signInError)
        setError(`Error de autenticación: ${signInError.message}`)
        setLoading(false)
        return
      }

      console.log('Login exitoso, configurando sesión...')

      // Set server-side cookie with the session
      try {
        const res = await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in
          })
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          console.error('Error session:', errorData)
          setError(`Error configurando sesión: ${errorData.error || res.statusText}`)
          setLoading(false)
          return
        }

        console.log('Sesión configurada, redirigiendo...')
        router.replace('/')
      } catch (fetchError) {
        console.error('Error fetch session:', fetchError)
        setError('Error de conexión al servidor')
        setLoading(false)
      }
    } catch (err) {
      console.error('Error inesperado:', err)
      setError('Error inesperado: ' + (err.message || 'Desconocido'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="p-8 rounded-lg shadow-md bg-white w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Stone by Ric CRM</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario (o email)</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="stonebyric"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </form>
    </div>
  )
}