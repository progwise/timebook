import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const projectMembershipDeleteMutation = gql`
  mutation projectMembershipDelete($userID: ID!, $projectID: ID!) {
    projectMembershipDelete(userId: $userID, projectId: $projectID) {
      title
      members {
        id
      }
    }
  }
`
beforeEach(async () => {
  await prisma.user.createMany({
    data: [
      {
        id: '1',
        name: 'User with project membership',
      },
      {
        id: '2',
        name: 'User without project membership',
      },
    ],
  })
  await prisma.project.create({
    data: {
      title: 'P1',
      id: 'project1',
      projectMemberships: { create: { userId: '1' } },
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
      userID: '2',
      projectID: 'project1',
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
      userID: '2',
      projectID: 'project1',
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
      userID: '2',
      projectID: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('project membership not found')])
  expect(response.data).toBeNull()
})

it('should throw error when trying to delete last project membership', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipDeleteMutation,
    variables: {
      userID: '1',
      projectID: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Membership can not be deleted because user is the last member')])
  expect(response.data).toBeNull()
})

it('should delete an existing projectMembership', async () => {
  await prisma.projectMembership.create({ data: { projectId: 'project1', userId: '2' } })
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipDeleteMutation,
    variables: {
      userID: '2',
      projectID: 'project1',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({ projectMembershipDelete: { members: [{ id: '1' }], title: 'P1' } })
})
