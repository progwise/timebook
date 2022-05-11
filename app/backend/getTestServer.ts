import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-micro'
import { Context } from './graphql/context'
import { schema } from './graphql/schema'

export const getTestServer = (options: {
  teamSlug?: string
  prisma: PrismaClient
  noSession?: boolean
  userId?: string
}) =>
  new ApolloServer({
    schema: schema,
    context: {
      prisma: options.prisma,
      teamSlug: options.teamSlug,
      session: options.noSession
        ? undefined
        : {
            user: {
              id: options.userId ?? '1',
            },
          },
    } as Context,
  })
