import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const projectMembershipInvitationCreateMutationField = gql`
  mutation projectMembershipInvitationCreate($projectId: ID!) {
    projectMembershipInvitationCreate(projectId: $projectId) {
      id
    }
  }
`

beforeEach(async () => {
  await prisma.user.create({
    data: {
      id: '1',
      name: 'User with project membership and admin role',
    },
  })

  await prisma.project.create({
    data: {
      title: 'P1',
      id: 'project1',
    },
  })

  await prisma.projectMembership.create({
    data: {
      projectId: 'project1',
      userId: '1',
      role: 'ADMIN',
      invitationId: 'invitation1',
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
    query: projectMembershipInvitationCreateMutationField,
    variables: { projectId: 'project1' },
  })

  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should create a project invitation', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipInvitationCreateMutationField,
    variables: { projectId: 'project1' },
  })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    projectMembershipInvitationCreate: {
      id: expect.any(String),
    },
  })
})
