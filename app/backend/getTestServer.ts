import { ApolloServer } from 'apollo-server-micro'
import { Context } from './graphql/context'
import { schema } from './graphql/schema'

export const getTestServer = (options: { noSession?: boolean; userId?: string } = {}) =>
  new ApolloServer({
    schema: schema,
    context: {
      session: options.noSession
        ? undefined
        : {
            user: {
              id: options.userId ?? '1',
            },
          },
    } as Context,
  })
