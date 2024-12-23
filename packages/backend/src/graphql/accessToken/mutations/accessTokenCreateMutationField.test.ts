import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const accessTokenCreateMutation = gql`
  mutation accessTokenCreateMutation($name: String!) {
    accessTokenCreate(name: $name)
  }
`
describe('accessTokenCreateMutationField', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany()

    await prisma.user.create({
      data: { id: '1', name: 'Test user' },
    })
  })

  it('should throw an error when user is unauthenticated', async () => {
    const testServer = getTestServer({ noSession: true })
    const response = await testServer.executeOperation({
      query: accessTokenCreateMutation,
      variables: {
        name: 'new token',
      },
    })
    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should create a new access token', async () => {
    const testServer = getTestServer()
    const response = await testServer.executeOperation({
      query: accessTokenCreateMutation,
      variables: {
        name: 'new token',
      },
    })

    expect(response.data).toEqual({
      accessTokenCreate: expect.any(String),
    })

    const accessTokens = await prisma.accessToken.findMany()
    expect(accessTokens).toEqual([
      {
        createdAt: expect.any(Date),
        id: expect.any(String),
        name: 'new token',
        tokenHash: expect.any(String),
        userId: '1',
      },
    ])
  })
})
