import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const projectMembershipCreateMutation = gql`
  mutation projectMembershipCreate($userID: ID!, $projectID: ID!) {
    projectMembershipCreate(userId: $userID, projectId: $projectID) {
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
  // await prisma.project.create({
  //   data: { title: 'P2', id: 'project2' },
  // })
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

it('should create projectMembership when session user is project membership', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipCreateMutation,
    variables: {
      userID: '2',
      projectID: 'project1',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({ projectMembershipCreate: { title: 'P1', members: [{ id: '2' }, { id: '1' }] } })
})

it('user is already project member', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipCreateMutation,
    variables: {
      userID: '1',
      projectID: 'project1',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({ projectMembershipCreate: { title: 'P1', members: [{ id: '1' }] } })
})
