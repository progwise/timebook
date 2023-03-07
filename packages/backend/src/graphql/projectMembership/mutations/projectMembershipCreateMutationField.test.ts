import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const projectMembershipCreateMutation = gql`
  mutation projectMembershipCreate($userID: ID!, $projectID: ID!, $role: Role) {
    projectMembershipCreate(userId: $userID, projectId: $projectID, role: $role) {
      title
      members {
        id
        projectRole(projectId: $projectID)
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
    query: projectMembershipCreateMutation,
    variables: {
      userID: '2',
      projectID: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw error when user is not a project member', async () => {
  const testServer = getTestServer({ userId: '2' })
  const response = await testServer.executeOperation({
    query: projectMembershipCreateMutation,
    variables: {
      userID: '2',
      projectID: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw error when user is a project member but has role=Member', async () => {
  const testServer = getTestServer({ userId: '3' })
  const response = await testServer.executeOperation({
    query: projectMembershipCreateMutation,
    variables: {
      userID: '2',
      projectID: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw error when downgrading the last admin', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipCreateMutation,
    variables: {
      userID: '1',
      projectID: 'project1',
      role: 'MEMBER',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Membership can not be changed because user is the last admin')])
  expect(response.data).toBeNull()
})

it('should create projectMembership when session user is project membership and has role=admin', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipCreateMutation,
    variables: {
      userID: '2',
      projectID: 'project1',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    projectMembershipCreate: {
      title: 'P1',
      members: [
        { id: '1', projectRole: 'ADMIN' },
        { id: '3', projectRole: 'MEMBER' },
        { id: '2', projectRole: 'MEMBER' },
      ],
    },
  })
})

it('user is already project member', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipCreateMutation,
    variables: {
      userID: '3',
      projectID: 'project1',
      role: 'ADMIN',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    projectMembershipCreate: {
      title: 'P1',
      members: [
        { id: '1', projectRole: 'ADMIN' },
        { id: '3', projectRole: 'ADMIN' },
      ],
    },
  })
})
