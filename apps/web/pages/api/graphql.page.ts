import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-micro'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import { Context, schema } from '@progwise/timebook-backend'

import { nextAuthOptions } from './auth/[...nextauth].page'

export const context = async ({
  req: request,
  res: response,
}: {
  req: NextApiRequest
  res: NextApiResponse
}): Promise<Context> => ({
  session: await getServerSession(request, response, nextAuthOptions),
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
