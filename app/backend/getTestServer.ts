import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-micro'
import { Context } from './graphql/context'
import { schema } from './graphql/schema'

export const getTestServer = (options: { teamSlug?: string; prisma: PrismaClient }) =>
  new ApolloServer({
    schema: schema,
    context: {
      prisma: options.prisma,
      teamSlug: options.teamSlug,
      session: {
        user: {
          id: '1',
        },
      },
    } as Context,
  })
