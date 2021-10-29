import { PrismaClient } from '@prisma/client'
import { NextApiRequest } from 'next'
import { Session } from 'next-auth'
import { getSession } from 'next-auth/react'

export interface Context {
    prisma: PrismaClient
    session: Session | null
}

const prisma = new PrismaClient()

export const context = async ({ req: request }: { req: NextApiRequest }): Promise<Context> => {
    const session = await getSession({ req: request })
    return { prisma, session }
}
