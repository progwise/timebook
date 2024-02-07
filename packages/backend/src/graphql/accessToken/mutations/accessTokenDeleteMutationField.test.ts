import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from './../../../getTestServer'

const prisma = new PrismaClient()

const accessTokenDeleteMutation = gql`
  mutation accessTokenDeleteMutation($id: ID!) {
    accessTokenDelete(id: $id) {
      id
    }
  }
`
describe('accessTokenDeleteMutationField', () => {
  beforeEach(async () => {
    await prisma.accessToken.deleteMany()
    await prisma.user.deleteMany()

    await prisma.user.create({
      data: {
        id: '1',
        name: 'Test User with an access token',
        accessTokens: {
          create: {
            name: 'access-token-name',
            tokenHash: 'access-token-hash',
            id: 'access-token-1',
          },
        },
      },
    })

    await prisma.user.create({
      data: {
        id: '2',
        name: 'Test User with no access token',
      },
    })
  })

  it('should throw an error when unauthorized', async () => {
    const testServer = getTestServer({ noSession: true })
    const response = await testServer.executeOperation({
      query: accessTokenDeleteMutation,
      variables: { id: 'access-token-1' },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it("should throw an error when access token doesn't belong to the user", async () => {
    const testServer = getTestServer({ userId: '2' })
    const response = await testServer.executeOperation({
      query: accessTokenDeleteMutation,
      variables: { id: 'access-token-1' },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should delete access token which belongs to the user', async () => {
    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: accessTokenDeleteMutation,
      variables: { id: 'access-token-1' },
    })

    expect(response.data).toEqual({ accessTokenDelete: { id: 'access-token-1' } })
    expect(response.errors).toBeUndefined()
    expect(await prisma.accessToken.count()).toBe(0)
  })
})
