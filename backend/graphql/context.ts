import { PrismaClient } from '@prisma/client'

export interface IContext {
  prisma: PrismaClient
}

const prisma = new PrismaClient()

export const context: IContext = {
  prisma: prisma,
}
