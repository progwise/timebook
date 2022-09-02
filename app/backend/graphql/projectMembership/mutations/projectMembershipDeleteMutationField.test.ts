import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { getTestServer } from '../../../getTestServer'
import '../../../prisma/prismaVitestEnvironment'

let prisma: PrismaClient
beforeAll(() => {
  prisma = new PrismaClient()
})

const projectMembershipDeleteMutation = `
mutation projectMembershipDelete($userID: ID!, $projectID: ID!) {
  projectMembershipDelete(userId: $userID, projectId: $projectID) {
    title, members{id}
  }
}
`
beforeEach(async () => {
  await prisma.user.createMany({
    data: [
      {
        id: '1',
      },
      {
        id: '2',
      },
      {
        id: '3',
      },
    ],
  })
  await prisma.team.create({
    data: { slug: 'Papa', title: 'Papa2', id: 'team1' },
  })
  await prisma.teamMembership.createMany({
    data: [
      { teamId: 'team1', role: 'ADMIN', userId: '1' },
      { teamId: 'team1', userId: '2' },
    ],
  })
  await prisma.project.create({
    data: { title: 'P1', teamId: 'team1', id: 'project1' },
  })
  await prisma.team.create({
    data: { slug: 'Mama', title: 'Mama2', id: 'team2' },
  })
  await prisma.project.create({
    data: { title: 'P2', teamId: 'team2', id: 'project2' },
  })
})
afterEach(async () => {
  await prisma.project.deleteMany()
  await prisma.team.deleteMany()
  await prisma.user.deleteMany()
})

it('should throw error when user is unauthorized', async () => {
  const testServer = getTestServer({ prisma, noSession: true })
  const response = await testServer.executeOperation({
    query: projectMembershipDeleteMutation,
    variables: {
      userID: '1',
      projectID: 'cl3sxwa3m2934q1gf83dud5s2',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw new errror when user is not admin', async () => {
  const testServer = getTestServer({ prisma, userId: '2', teamSlug: 'Papa' })
  const response = await testServer.executeOperation({
    query: projectMembershipDeleteMutation,
    variables: {
      userID: '1',
      projectID: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw error if deleting a non existing membership', async () => {
  const testServer = getTestServer({ prisma, userId: '1', teamSlug: 'Papa' })
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

it('user must be team member', async () => {
  const testServer = getTestServer({ prisma, teamSlug: 'Papa', userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipDeleteMutation,
    variables: {
      userID: '3',
      projectID: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('user can not change project memberships of another team', async () => {
  const testServer = getTestServer({ prisma, teamSlug: 'Papa', userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipDeleteMutation,
    variables: {
      userID: '2',
      projectID: 'project2',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should delete an existing projectMembership', async () => {
  await prisma.projectMembership.create({
    data: { projectId: 'project1', userId: '2' },
  })
  const testServer = getTestServer({ prisma, teamSlug: 'Papa', userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipDeleteMutation,
    variables: {
      userID: '2',
      projectID: 'project1',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({ projectMembershipDelete: { members: [], title: 'P1' } })
})
