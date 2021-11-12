import { NextApiHandler } from 'next'
import { server } from '../../backend/server'

const startPromise = server.start()

const graphqlHandler: NextApiHandler = async (request, response) => {
  await startPromise

  return server.createHandler({ path: '/api/graphql' })(request, response)
}
export const config = {
  api: {
    bodyParser: false,
  },
}

export default graphqlHandler
