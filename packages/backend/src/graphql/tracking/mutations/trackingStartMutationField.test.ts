/* eslint-disable unicorn/no-null */
import { gql } from 'apollo-server-core'
import { getMonth, getYear } from 'date-fns'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const trackingStartMutation = gql`
  mutation trackingStart($taskId: ID!) {
    trackingStart(taskId: $taskId) {
      start
      task {
        id
        title
      }
    }
  }
`

beforeEach(async () => {
  await prisma.tracking.deleteMany()
  await prisma.workHour.deleteMany()
  await prisma.lockedMonth.deleteMany()
  await prisma.task.deleteMany()
  await prisma.project.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.create({ data: { id: '1', name: 'User 1' } })
  await prisma.project.create({
    data: {
      id: 'P1',
      title: 'Project 1',
      tasks: {
        createMany: {
          data: [
            {
              id: 'T1',
              title: 'Task 1',
            },
            {
              id: 'T2',
              title: 'Task 2',
            },
          ],
        },
      },
      projectMemberships: { create: { userId: '1' } },
    },
  })
})

it('should throw error when user is unauthorized', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({ query: trackingStartMutation, variables: { taskId: 'T1' } })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw error when user is not a project member', async () => {
  await prisma.projectMembership.delete({ where: { userId_projectId: { userId: '1', projectId: 'P1' } } })

  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingStartMutation, variables: { taskId: 'T1' } })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw error when project is locked', async () => {
  const now = new Date()
  await prisma.lockedMonth.create({ data: { year: getYear(now), month: getMonth(now), projectId: 'P1' } })

  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingStartMutation, variables: { taskId: 'T1' } })
  expect(response.errors).toEqual([new GraphQLError('Project is locked for this month')])
  expect(response.data).toBeNull()
})

it('should throw error when task of ongoing tracking is locked', async () => {
  await prisma.tracking.create({ data: { taskId: 'T1', userId: '1', start: new Date('2023-01-01') } })
  await prisma.task.update({ where: { id: 'T1' }, data: { isLocked: true } })

  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingStartMutation, variables: { taskId: 'T2' } })
  expect(response.errors).toEqual([new GraphQLError('task is locked')])
  expect(response.data).toBeNull()
})

it('should throw error when task of new tracking is locked', async () => {
  await prisma.task.update({ where: { id: 'T1' }, data: { isLocked: true } })

  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingStartMutation, variables: { taskId: 'T1' } })
  expect(response.errors).toEqual([new GraphQLError('task is locked')])
  expect(response.data).toBeNull()
})

it('should throw error when ongoing tracking is from an archived project', async () => {
  await prisma.project.create({
    data: {
      id: 'P2',
      title: 'Project 2',
      archivedAt: new Date(),
      tasks: {
        create: {
          id: 'T3',
          title: 'Task 3',
          trackings: { create: { start: new Date(), userId: '1' } },
        },
      },
      projectMemberships: { create: { userId: '1' } },
    },
  })

  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingStartMutation, variables: { taskId: 'T1' } })
  expect(response.errors).toEqual([new GraphQLError('project is archived')])
  expect(response.data).toBeNull()
})

it('should throw error when trying to start tracking on an archived project', async () => {
  await prisma.project.update({ where: { id: 'P1' }, data: { archivedAt: new Date() } })

  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingStartMutation, variables: { taskId: 'T1' } })
  expect(response.errors).toEqual([new GraphQLError('project is archived')])
  expect(response.data).toBeNull()
})

it('should start tracking when tracking is running', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingStartMutation, variables: { taskId: 'T1' } })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    trackingStart: {
      start: expect.any(Date),
      task: { id: 'T1', title: 'Task 1' },
    },
  })

  expect(await prisma.tracking.count()).toBe(1)
})

it('should keep tracking of the same task untouched', async () => {
  const startDate = new Date('2023-01-01')
  await prisma.tracking.create({ data: { taskId: 'T1', userId: '1', start: startDate } })

  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingStartMutation, variables: { taskId: 'T1' } })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    trackingStart: {
      start: startDate,
      task: { id: 'T1', title: 'Task 1' },
    },
  })
})

it('should stop the ongoing tracking when starting tracking on different task', async () => {
  await prisma.tracking.create({ data: { taskId: 'T1', userId: '1' } })

  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingStartMutation, variables: { taskId: 'T2' } })

  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    trackingStart: {
      start: expect.any(Date),
      task: { id: 'T2', title: 'Task 2' },
    },
  })

  expect(await prisma.workHour.count()).toBe(1)
})
