import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const accessTokensQuery = gql`
  query accessTokens {
    accessTokens {
      createdAt
      id
      name
    }
  }
`
beforeAll(async () => {
  await prisma.user.createMany({
    data: [{ id: '1' }, { id: '2' }],
  })
  await prisma.accessToken.createMany({
    data: [
      {
        id: 'A1',
        tokenHash: 'A',
        userId: '1',
        name: 'access token from user 1',
        createdAt: '2024-01-09T15:22:22.065Z',
      },
      { id: 'A2', tokenHash: 'B', userId: '2', name: 'access token from user 2' },
    ],
  })
})

it('should throw error when not signed in', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({ query: accessTokensQuery })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should return all access tokens of the user', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: accessTokensQuery,
  })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    accessTokens: [
      {
        createdAt: new Date('2024-01-09T15:22:22.065Z'),
        id: 'A1',
        name: 'access token from user 1',
      },
    ],
  })
})
