import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const projectMembershipDeleteMutation = gql`
  mutation projectMembershipDelete($userId: ID!, $projectId: ID!) {
    projectMembershipDelete(userId: $userId, projectId: $projectId) {
      title
      members {
        id
        projectRole(projectId: $projectId)
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
    query: projectMembershipDeleteMutation,
    variables: {
      userId: '2',
      projectId: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw error when user is not project member', async () => {
  const testServer = getTestServer({ userId: '2' })
  const response = await testServer.executeOperation({
    query: projectMembershipDeleteMutation,
    variables: {
      userId: '2',
      projectId: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw error when user is project member but has role=Member', async () => {
  const testServer = getTestServer({ userId: '3' })
  const response = await testServer.executeOperation({
    query: projectMembershipDeleteMutation,
    variables: {
      userId: '2',
      projectId: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw error if deleting a non existing membership', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipDeleteMutation,
    variables: {
      userId: '2',
      projectId: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('project membership not found')])
  expect(response.data).toBeNull()
})

it('should throw error when trying to delete last project admin', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipDeleteMutation,
    variables: {
      userId: '1',
      projectId: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Membership can not be deleted because user is the last admin')])
  expect(response.data).toBeNull()
})

it('should delete an existing projectMembership when role=admin', async () => {
  await prisma.projectMembership.create({ data: { projectId: 'project1', userId: '2' } })
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipDeleteMutation,
    variables: {
      userId: '2',
      projectId: 'project1',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    projectMembershipDelete: {
      members: [
        { id: '1', projectRole: 'ADMIN' },
        { id: '3', projectRole: 'MEMBER' },
      ],
      title: 'P1',
    },
  })
})
