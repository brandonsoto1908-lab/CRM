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

  if (!token) {
    return res.status(401).json({ authenticated: false })
  }

  try {
    const { data, error } = await supabaseServer.auth.getUser(token)
    if (error || !data?.user) {
      return res.status(401).json({ authenticated: false })
    }

    return res.status(200).json({
      authenticated: true,
      user: {
        id: data.user.id,
        email: data.user.email
      }
    })
  } catch (err) {
    return res.status(401).json({ authenticated: false })
  }
}