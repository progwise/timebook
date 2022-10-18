import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const projectMembershipCreateMutation = `
mutation projectMembershipCreate($userID: ID!, $projectID: ID!) {
  projectMembershipCreate(userId: $userID, projectId: $projectID) {
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
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({
    query: projectMembershipCreateMutation,
    variables: {
      userID: '1',
      projectID: 'cl3sxwa3m2934q1gf83dud5s2',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should create projectMembership', async () => {
  const testServer = getTestServer()
  const response = await testServer.executeOperation({
    query: projectMembershipCreateMutation,
    variables: {
      userID: '2',
      projectID: 'project1',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({ projectMembershipCreate: { title: 'P1', members: [{ id: '2' }] } })
})

it('normal user can not add someone to the project', async () => {
  const testServer = getTestServer({ userId: '2' })
  const response = await testServer.executeOperation({
    query: projectMembershipCreateMutation,
    variables: {
      userID: '1',
      projectID: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('user can not change project memberships of another team', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipCreateMutation,
    variables: {
      userID: '2',
      projectID: 'project2',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('user must be team member', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipCreateMutation,
    variables: {
      userID: '3',
      projectID: 'project1',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('user is already project member', async () => {
  await prisma.projectMembership.create({
    data: { userId: '2', projectId: 'project1' },
  })
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({
    query: projectMembershipCreateMutation,
    variables: {
      userID: '2',
      projectID: 'project1',
    },
  })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({ projectMembershipCreate: { title: 'P1', members: [{ id: '2' }] } })
})
