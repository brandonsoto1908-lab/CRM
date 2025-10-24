function clearCookie(res, name) {
  res.setHeader('Set-Cookie', `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`)
}

export default async function handler(req, res) {
  // Clear both tokens
  clearCookie(res, 'sb_access_token')
  clearCookie(res, 'sb_refresh_token')
  
  return res.status(200).json({ ok: true })
}