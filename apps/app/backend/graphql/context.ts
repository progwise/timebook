import { NextApiRequest } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'

export interface Context {
  session: Session | null
}

export interface LoggedInContext extends Context {
  session: Session
}

export const context = async ({ req: request }: { req: NextApiRequest }): Promise<Context> => {
  const session = await getSession({ req: request })

  return { session }
}
