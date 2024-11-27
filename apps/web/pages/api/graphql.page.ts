import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-micro'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'

import { Context, hashAccessToken, prisma, schema } from '@progwise/timebook-backend'

import { nextAuthOptions } from './auth/[...nextauth].page'

export const context = async ({
  req: request,
  res: response,
}: {
  req: NextApiRequest
  res: NextApiResponse
}): Promise<Context> => {
  const session = await getServerSession(request, response, nextAuthOptions)
  if (session) {
    return {
      session,
    }
  }

  const accessTokenString = request.headers.authorization?.toString().split(/\s+/).at(1)
  if (!accessTokenString) {
    // eslint-disable-next-line unicorn/no-null
    return { session: null }
  }

  const tokenHash = hashAccessToken(accessTokenString)
  const accessToken = await prisma.accessToken.findUnique({ where: { tokenHash }, select: { user: true } })
  // eslint-disable-next-line unicorn/no-null
  return { session: accessToken ? { user: accessToken.user } : null }
}

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
