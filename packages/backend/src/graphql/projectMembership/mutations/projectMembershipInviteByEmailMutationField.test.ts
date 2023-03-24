import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const projectMembershipInviteByEmail = gql`
  mutation projectMembershipInviteByEmail($email: String!, $projectId: ID!) {
    projectMembershipInviteByEmail(email: $email, projectId: $projectId) {
      title
      members {
        name
      }
    }
  }
`
beforeEach(async () => {
  await prisma.user.createMany({
    data: [
      {
        id: '1',
        name: 'User with project membership (role=admin)',
      },
      {
        id: '2',
        name: 'User without project membership',
      },
      {
        id: '3',
        name: 'User with project membership (role=member)',
      },
    ],
  })
  await prisma.project.create({
    data: {
      title: 'P1',
      id: 'project1',
      projectMemberships: {
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
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()
})

it('should throw error when user is unauthorized', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({
    query: projectMembershipInviteByEmail,
    variables: {
      email: 'test@test.com',
      projectId: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw error when user is not a project member', async () => {
  const testServer = getTestServer({ userId: '2' })
  const response = await testServer.executeOperation({
    query: projectMembershipInviteByEmail,
    variables: {
      email: 'test@test.com',
      projectId: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw error when user is a project member but has role=Member', async () => {
  const testServer = getTestServer({ userId: '3' })
  const response = await testServer.executeOperation({
    query: projectMembershipInviteByEmail,
    variables: {
      email: 'test@test.com',
      projectId: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw error when email not exist', async () => {
  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({
    query: projectMembershipInviteByEmail,
    variables: {
      email: 'test@test.com',
      projectId: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('No user found with email test@test.com')])
  expect(response.data).toBeNull()
})

it('should throw error when user is already member', async () => {
  await prisma.user.create({
    data: {
      id: '4',
      name: 'new user',
      email: 'test@test.com',
      projectMemberships: { create: { projectId: 'project1' } },
    },
  })

  const testServer = getTestServer({ userId: '1' })

  const response = await testServer.executeOperation({
    query: projectMembershipInviteByEmail,
    variables: {
      email: 'test@test.com',
      projectId: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('User is already a member of the project')])
  expect(response.data).toBeNull()
})

it('should add a new member when email exist and role=Asmin', async () => {
  await prisma.user.create({ data: { id: '4', name: 'new user', email: 'test@test.com' } })

  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipInviteByEmail,
    variables: {
      email: 'test@test.com',
      projectId: 'project1',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    projectMembershipInviteByEmail: {
      members: [
        { name: 'new user' },
        { name: 'User with project membership (role=admin)' },
        { name: 'User with project membership (role=member)' },
      ],
      title: 'P1',
    },
  })
})
