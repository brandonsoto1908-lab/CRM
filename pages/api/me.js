import { supabaseServer } from '../../lib/supabaseServerClient'

function parseCookies(req) {
  const header = req.headers.cookie || ''
  return header.split(';').reduce((acc, cookie) => {
    const [key, ...rest] = cookie.trim().split('=')
    if (key) acc[key] = rest.join('=')
    return acc
  }, {})
}

export default async function handler(req, res) {
  const cookies = parseCookies(req)
  const token = cookies.sb_access_token

  console.log('API /me - Cookies recibidas:', Object.keys(cookies))
  console.log('API /me - Token encontrado:', token ? 'Sí' : 'No')

  if (!token) {
    console.log('API /me - No token, retornando 401')
    return res.status(401).json({ authenticated: false, error: 'No token found' })
  }

  try {
    const { data, error } = await supabaseServer.auth.getUser(token)
    if (error) {
      console.log('API /me - Error de Supabase:', error.message)
      return res.status(401).json({ authenticated: false, error: error.message })
    }
    if (!data?.user) {
      console.log('API /me - No user data')
      return res.status(401).json({ authenticated: false, error: 'No user data' })
    }

    console.log('API /me - Usuario autenticado:', data.user.email)
    return res.status(200).json({
      authenticated: true,
      user: {
        id: data.user.id,
        email: data.user.email
      }
    })
  } catch (err) {
    console.log('API /me - Error inesperado:', err.message)
    return res.status(401).json({ authenticated: false, error: err.message })
  }
}