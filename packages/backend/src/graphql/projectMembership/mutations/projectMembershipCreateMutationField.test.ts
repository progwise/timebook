import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const projectMembershipCreateMutation = gql`
  mutation projectMembershipCreate($userID: ID!, $projectID: ID!, $projectRole: Role) {
    projectMembershipCreate(userId: $userID, projectId: $projectID, projectRole: $projectRole) {
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
        name: 'User with project membership (role=Admin)',
      },
      {
        id: '2',
        name: 'User without project membership',
      },
      {
        id: '3',
        name: 'User with project membership (role=Member)',
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
            { userId: '1', projectRole: 'ADMIN' },
            { userId: '3', projectRole: 'MEMBER' },
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

it('should throw an error when the user is unauthorized', async () => {
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

it('should throw an error when the user is not a project member', async () => {
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

it('should throw an error when the user is a project member but has a role=Member', async () => {
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

it('should throw an error when downgrading the last admin', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipCreateMutation,
    variables: {
      userID: '1',
      projectID: 'project1',
      projectRole: 'MEMBER',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Membership cannot be changed because user is the last admin')])
  expect(response.data).toBeNull()
})

it('should create projectMembership when session user is project membership and has role=Admin', async () => {
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
        { id: '2', projectRole: 'MEMBER' },
        { id: '1', projectRole: 'ADMIN' },
        { id: '3', projectRole: 'MEMBER' },
      ],
    },
  })
})

it('user is already a project member', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipCreateMutation,
    variables: {
      userID: '3',
      projectID: 'project1',
      projectRole: 'ADMIN',
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
