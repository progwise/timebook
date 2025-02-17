import { createYoga } from 'graphql-yoga'
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

const yoga = createYoga({
  schema,
  context,
  graphqlEndpoint: '/api/graphql',
})

const graphqlHandler: NextApiHandler = async (request, response) => {
  return yoga(request, response)
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default graphqlHandler
