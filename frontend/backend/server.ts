import { ApolloServer } from 'apollo-server-micro'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { schema } from './schema'
import { context } from './context'

export const server = new ApolloServer({ schema, context, plugins: [ApolloServerPluginLandingPageGraphQLPlayground] })
