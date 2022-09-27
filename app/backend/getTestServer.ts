import { ApolloServer } from 'apollo-server-micro'
import { Context } from './graphql/context'
import { schema } from './graphql/schema'

export const getTestServer = (options: { teamSlug?: string; noSession?: boolean; userId?: string }) =>
  new ApolloServer({
    schema: schema,
    context: {
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
