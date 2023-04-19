/* eslint-disable unicorn/no-null */
import { gql } from 'apollo-server-core'
import { addDays, differenceInMinutes, format, getMonth, getYear, startOfDay, subDays } from 'date-fns'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const trackingStopMutation = gql`
  mutation trackingStop {
    trackingStop {
      id
      date
      duration
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
        create: {
          id: 'T1',
          title: 'Task 1',
        },
      },
      projectMemberships: { create: { userId: '1' } },
    },
  })
})

it('should throw error when user is unauthorized', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({ query: trackingStopMutation })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toBeNull()
})

it('should throw error when project is locked for the current month', async () => {
  const now = new Date()
  await prisma.tracking.create({ data: { userId: '1', taskId: 'T1', start: now } })
  await prisma.lockedMonth.create({ data: { projectId: 'P1', year: getYear(now), month: getMonth(now) } })

  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingStopMutation })
  expect(response.errors).toEqual([new GraphQLError('Project is locked for the current month')])
  expect(response.data).toBeNull()
})

it('should throw error when user is not a project member', async () => {
  const now = new Date()
  await prisma.tracking.create({ data: { userId: '1', taskId: 'T1', start: now } })
  await prisma.projectMembership.delete({ where: { userId_projectId: { userId: '1', projectId: 'P1' } } })

  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingStopMutation })
  expect(response.errors).toEqual([new GraphQLError('User is no longer a project member')])
  expect(response.data).toBeNull()
})

it('should return empty array when there is no ongoing tracking', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingStopMutation })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({ trackingStop: [] })
})

it('should throw error when project is archived', async () => {
  const now = new Date()
  await prisma.tracking.create({ data: { userId: '1', taskId: 'T1', start: now } })
  await prisma.project.update({ where: { id: 'P1' }, data: { archivedAt: now } })

  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingStopMutation })
  expect(response.errors).toEqual([new GraphQLError('project is archived')])
  expect(response.data).toBeNull()
})

it('should create one workHour for a tracking on one day', async () => {
  const now = new Date()
  const start = startOfDay(now)
  const expectedDuration = differenceInMinutes(now, start)

  await prisma.tracking.create({ data: { userId: '1', taskId: 'T1', start } })
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingStopMutation })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    trackingStop: [
      {
        date: format(start, 'yyyy-MM-dd'),
        duration: expectedDuration,
        id: expect.any(String),
        task: { id: 'T1', title: 'Task 1' },
      },
    ],
  })

  expect(await prisma.workHour.count()).toBe(1)
  expect(await prisma.tracking.count()).toBe(0)
})

it('should create multiple workHours for a tracking on more than one day', async () => {
  const now = new Date()
  const start = startOfDay(subDays(now, 2))

  await prisma.tracking.create({ data: { userId: '1', taskId: 'T1', start } })
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingStopMutation })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({
    trackingStop: [
      {
        date: format(start, 'yyyy-MM-dd'),
        duration: expect.any(Number),
        id: expect.any(String),
        task: { id: 'T1', title: 'Task 1' },
      },
      {
        date: format(addDays(start, 1), 'yyyy-MM-dd'),
        duration: expect.any(Number),
        id: expect.any(String),
        task: { id: 'T1', title: 'Task 1' },
      },
      {
        date: format(addDays(start, 2), 'yyyy-MM-dd'),
        duration: expect.any(Number),
        id: expect.any(String),
        task: { id: 'T1', title: 'Task 1' },
      },
    ],
  })

  expect(await prisma.workHour.count()).toBe(3)
  expect(await prisma.tracking.count()).toBe(0)
})
