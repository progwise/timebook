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
    query: projectMembershipDeleteMutation,
    variables: {
      userId: '2',
      projectId: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw an error when the user is not a project member', async () => {
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

it('should throw an error when the user is a project member but has role=Member', async () => {
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

it('should throw an error when deleting a non existing membership', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipDeleteMutation,
    variables: {
      userId: '2',
      projectId: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Project membership not found')])
  expect(response.data).toBeNull()
})

it('should throw an error when trying to delete last project admin', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipDeleteMutation,
    variables: {
      userId: '1',
      projectId: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Membership cannot be deleted because the user is the last admin')])
  expect(response.data).toBeNull()
})

it('should delete an existing projectMembership when role=Admin', async () => {
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

it('should delete an admin when there are more than one admin', async () => {
  await prisma.projectMembership.update({
    where: { userId_projectId: { projectId: 'project1', userId: '3' } },
    data: { projectRole: 'ADMIN' },
  })
  const testServer = getTestServer({ userId: '3' })
  const response = await testServer.executeOperation({
    query: projectMembershipDeleteMutation,
    variables: {
      userId: '1',
      projectId: 'project1',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    projectMembershipDelete: {
      members: [{ id: '3', projectRole: 'ADMIN' }],
      title: 'P1',
    },
  })

  const deletedMembership = await prisma.projectMembership.findUnique({
    where: {
      userId_projectId: { projectId: 'project1', userId: '1' },
    },
  })
  expect(deletedMembership).toBeNull()
})
