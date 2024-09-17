import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const projectMembershipInvitationCreateMutationField = gql`
  mutation projectMembershipInvitationCreate($projectId: ID!) {
    projectMembershipInvitationCreate(projectId: $projectId) {
      id
      expireDate
    }
  }
`

beforeEach(async () => {
  await prisma.user.createMany({
    data: [
      {
        id: '1',
        name: 'User with project membership and admin role',
      },
      {
        id: '2',
        name: 'User with project membership and member role',
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
            { userId: '2', projectRole: 'MEMBER' },
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
      expireDate: expect.any(Date),
    },
  })

  const expireDate: Date = response.data!.projectMembershipInvitationCreate.expireDate
  const differenceInDays = (expireDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  expect(differenceInDays).toBeCloseTo(3, 0)
})

it('should throw an error when the user is not an admin', async () => {
  const testServer = getTestServer({ userId: '2' })
  const response = await testServer.executeOperation({
    query: projectMembershipInvitationCreateMutationField,
    variables: { projectId: 'project1' },
  })

  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})
