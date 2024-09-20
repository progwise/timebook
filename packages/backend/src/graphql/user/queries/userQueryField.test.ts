import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const durationWorkedOnProjectQuery = gql`
  query durationWorkedOnProject($userID: ID!, $projectID: ID!, $from: Date!, $to: Date) {
    user(userId: $userID) {
      durationWorkedOnProject(projectId: $projectID, from: $from, to: $to)
    }
  }
`

beforeEach(async () => {
  await prisma.workHour.deleteMany()
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.createMany({
    data: [
      { id: '1', name: 'user with project membership' },
      { id: '2', name: 'user without project membership' },
    ],
  })

  await prisma.project.create({
    data: {
      id: 'project1',
      title: 'P1',
      projectMemberships: { create: { userId: '1' } },
      tasks: { create: { id: 'task1', title: 'T1' } },
    },
  })

  await prisma.workHour.create({
    data: { date: new Date('2022-01-01'), duration: 60, taskId: 'task1', userId: '1' },
  })
})

it('should throw an error when the user is not authorized', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({
    query: durationWorkedOnProjectQuery,
    variables: {
      userID: '1',
      projectID: 'project1',
      from: '2022-01-01',
    },
  })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

describe('durationWorkedOnProject', () => {
  it('should throw an error when the user is not a project member', async () => {
    const testServer = getTestServer({ userId: '2' })
    const response = await testServer.executeOperation({
      query: durationWorkedOnProjectQuery,
      variables: {
        userID: '2',
        projectID: 'P1',
        from: '2022-01-01',
      },
    })
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
    expect(response.data).toBeNull()
  })
  it('should return the duration worked on the project', async () => {
    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: durationWorkedOnProjectQuery,
      variables: {
        userID: '1',
        projectID: 'project1',
        from: '2022-01-01',
      },
    })
    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      user: {
        durationWorkedOnProject: 60,
      },
    })
  })
})
