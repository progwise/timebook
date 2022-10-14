import { NextApiRequest } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'

export interface Context {
  session: Session | null
  teamSlug?: string
}

export interface LoggedInContext extends Context {
  session: Session
}

export interface LoggedInInSlugContext extends LoggedInContext {
  teamSlug: string
}

export const context = async ({ req: request }: { req: NextApiRequest }): Promise<Context> => {
  const session = await getSession({ req: request })
  const teamSlug: string | undefined = request.query.teamSlug?.toString()

  return { session, teamSlug }
}
