import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const organizationMembershipCreateMutation = gql`
  mutation organizationMembershipCreate($userId: ID!, $organizationId: ID!, $role: Role) {
    organizationMembershipCreate(userId: $userId, organizationId: $organizationId, role: $role) {
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
      id: 'Organization 1',
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
    query: organizationMembershipCreateMutation,
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
    query: organizationMembershipCreateMutation,
    variables: {
      userId: '2',
      organizationId: 'organization1',
    },
  })

  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

it('should throw an error when downgrading the last admin', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: organizationMembershipCreateMutation,
    variables: {
      userId: '1',
      organizationId: 'Organization 1',
      role: 'MEMBER',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Cannot remove the last admin of an organization')])
  expect(response.data).toBeNull()
})

it('should create organizationMembership when session user is organization admin', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: organizationMembershipCreateMutation,
    variables: {
      userId: '2',
      organizationId: 'Organization 1',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    organizationMembershipCreate: {
      title: 'O1',
      members: [
        { id: '1', role: 'ADMIN' },
        { id: '3', role: 'MEMBER' },
        { id: '2', role: 'MEMBER' },
      ],
    },
  })
})

it('user is already an organization member', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: organizationMembershipCreateMutation,
    variables: {
      userId: '3',
      organizationId: 'Organization 1',
      role: 'ADMIN',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    organizationMembershipCreate: {
      title: 'O1',
      members: [
        { id: '1', role: 'ADMIN' },
        { id: '3', role: 'ADMIN' },
      ],
    },
  })
})
