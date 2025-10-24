import crypto from 'crypto'

const ALGORITHM = 'sha256'

export function sign(payload, secret) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64')
  const sig = crypto.createHmac(ALGORITHM, secret).update(data).digest('base64')
  return `${data}.${sig}`
}

export function verify(token, secret) {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [data, sig] = parts
  try {
    const expected = crypto.createHmac(ALGORITHM, secret).update(data).digest('base64')
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
    const payload = JSON.parse(Buffer.from(data, 'base64').toString('utf8'))
    return payload
  } catch (e) {
    return null
  }
}
