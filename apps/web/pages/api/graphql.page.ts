import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-micro'
import { NextApiHandler, NextApiRequest } from 'next'
import { getSession } from 'next-auth/react'

import { Context, schema } from '@progwise/timebook-backend'

export const context = async ({ req: request }: { req: NextApiRequest }): Promise<Context> => ({
  session: await getSession({ req: request }),
})

export const server = new ApolloServer({
  schema,
  context,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({ settings: { 'request.credentials': 'include' } })],
})

const startPromise = server.start()

const graphqlHandler: NextApiHandler = async (request, response) => {
  await startPromise

  return server.createHandler({ path: request.url })(request, response)
}
export const config = {
  api: {
    bodyParser: false,
  },
}

export default graphqlHandler
