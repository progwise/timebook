import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const projectMembershipJoin = gql`
  mutation projectMembershipJoin($inviteKey: String!) {
    projectMembershipJoin(inviteKey: $inviteKey) {
      title
      members {
        name
      }
    }
  }
`

beforeEach(async () => {
  await prisma.project.create({
    data: {
      title: 'P1',
      id: 'project1',
      inviteKey: 'test-invite-key',
    },
  })

  await prisma.user.create({
    data: {
      id: '1',
      name: 'User without project membership',
    },
  })
})

afterEach(async () => {
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()
})

it('should throw error when user is unauthorized', async () => {
  const testServer = getTestServer({ noSession: true })

  const response = await testServer.executeOperation({
    query: projectMembershipJoin,
    variables: {
      inviteKey: 'test-invite-key',
    },
  })

  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw error when invite key is invalid', async () => {
  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({
    query: projectMembershipJoin,
    variables: {
      inviteKey: 'invalid-invite-key',
    },
  })

  expect(response.errors).toEqual([new GraphQLError('Invalid invite key')])
  expect(response.data).toBeNull()
})

it('should join project when invite key is valid', async () => {
  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({
    query: projectMembershipJoin,
    variables: {
      inviteKey: 'test-invite-key',
    },
  })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    projectMembershipJoin: {
      title: 'P1',
      members: [{ name: 'User without project membership' }],
    },
  })
})

it('should not throw error when user is already a member of the project', async () => {
  await prisma.projectMembership.create({
    data: {
      userId: '1',
      projectId: 'project1',
    },
  })

  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({
    query: projectMembershipJoin,
    variables: {
      inviteKey: 'test-invite-key',
    },
  })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    projectMembershipJoin: {
      title: 'P1',
      members: [{ name: 'User without project membership' }],
    },
  })
})
