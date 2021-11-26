import { PrismaClient } from '@prisma/client'
import { NextApiRequest } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'

export interface Context {
  prisma: PrismaClient
  session: Session | null
}

// from https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export const context = async ({ req: request }: { req: NextApiRequest }): Promise<Context> => {
  const session = await getSession({ req: request })
  return { prisma, session }
}
