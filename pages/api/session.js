import { supabaseServer } from '../../lib/supabaseServerClient'

function setCookies(res, cookies) {
  const cookieStrings = cookies.map(({ name, value, opts = {} }) => {
    const { maxAge, path = '/', httpOnly = true, sameSite = 'Lax', secure = false } = opts
    let cookie = `${name}=${value}; Path=${path}; SameSite=${sameSite}`
    if (httpOnly) cookie += '; HttpOnly'
    if (secure) cookie += '; Secure'
    if (maxAge) cookie += `; Max-Age=${maxAge}`
    return cookie
  })
  res.setHeader('Set-Cookie', cookieStrings)
}

export default async function handler(req, res) {
  try {
    // Validate request method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // Validate body
    const { access_token, refresh_token, expires_in } = req.body || {}
    if (!access_token) {
      return res.status(400).json({ error: 'Missing access_token in request body' })
    }

    // Verify token with Supabase
    const { data, error } = await supabaseServer.auth.getUser(access_token)
    if (error) {
      console.error('Supabase getUser error:', error)
      return res.status(401).json({ error: 'Invalid token: ' + error.message })
    }
    if (!data?.user) {
      return res.status(401).json({ error: 'No user found for token' })
    }

    // Set cookies
    const secure = process.env.NODE_ENV === 'production'
    const cookieOptions = {
      httpOnly: true,
      sameSite: 'Lax',
      secure,
      path: '/'
    }

    // Build cookies array
    const cookies = [
      {
        name: 'sb_access_token',
        value: access_token,
        opts: { ...cookieOptions, maxAge: expires_in || 3600 }
      }
    ]

    if (refresh_token) {
      cookies.push({
        name: 'sb_refresh_token',
        value: refresh_token,
        opts: { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 }
      })
    }

    setCookies(res, cookies)

    return res.status(200).json({ ok: true, user: { id: data.user.id, email: data.user.email } })
  } catch (err) {
    console.error('Session endpoint error:', err)
    return res.status(500).json({ error: 'Internal server error: ' + err.message })
  }
}
