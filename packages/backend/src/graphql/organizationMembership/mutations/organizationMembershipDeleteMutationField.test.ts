import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const organizationMembershipDeleteMutation = gql`
  mutation projectMembershipDelete($userId: ID!, $organizationId: ID!) {
    organizationMembershipDelete(userId: $userId, organizationId: $organizationId) {
      title
      members {
        id
        role(organizationId: $organizationId)
      }
    }
  }
`
beforeEach(async () => {
  await prisma.user.createMany({
    data: [
      {
        id: '1',
        name: 'User with organization membership (role=admin)',
      },
      {
        id: '2',
        name: 'User without organization membership',
      },
      {
        id: '3',
        name: 'User with organization membership (role=member)',
      },
    ],
  })
  await prisma.organization.create({
    data: {
      title: 'O1',
      id: 'organization1',
      organizationMemberships: {
        createMany: {
          data: [
            { userId: '1', role: 'ADMIN' },
            { userId: '3', role: 'MEMBER' },
          ],
        },
      },
    },
  })
})
afterEach(async () => {
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()
})

it('should throw an error when the user is unauthorized', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({
    query: organizationMembershipDeleteMutation,
    variables: {
      userId: '2',
      organizationId: 'organization1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw an error when the user is not an organization member', async () => {
  const testServer = getTestServer({ userId: '2' })
  const response = await testServer.executeOperation({
    query: organizationMembershipDeleteMutation,
    variables: {
      userId: '2',
      organizationId: 'organization1',
    },
  })

  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw an error when the user is an organization member but has role=Member', async () => {
  const testServer = getTestServer({ userId: '3' })
  const response = await testServer.executeOperation({
    query: organizationMembershipDeleteMutation,
    variables: {
      userId: '2',
      organizationId: 'organization1',
    },
  })

  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw an error when deleting a non existing membership', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: organizationMembershipDeleteMutation,
    variables: {
      userId: '2',
      organizationId: 'organization1',
    },
  })

  expect(response.errors).toEqual([new GraphQLError('Organization membership not found')])
  expect(response.data).toBeNull()
})

it('should throw an error when trying to delete last organization admin', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: organizationMembershipDeleteMutation,
    variables: {
      userId: '1',
      organizationId: 'organization1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Membership cannot be deleted because the user is the last admin')])
  expect(response.data).toBeNull()
})

it('should delete an existing organizationMembership when role=admin', async () => {
  await prisma.organizationMembership.create({ data: { organizationId: 'organization1', userId: '2' } })
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: organizationMembershipDeleteMutation,
    variables: {
      userId: '2',
      organizationId: 'organization1',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    organizationMembershipDelete: {
      members: [
        { id: '1', role: 'ADMIN' },
        { id: '3', role: 'MEMBER' },
      ],
      title: 'O1',
    },
  })
})
