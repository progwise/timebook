import { createHash } from 'crypto'

export const hashAccessToken = (accessTokenString: string) =>
  createHash('sha256').update(accessTokenString).digest('hex')
