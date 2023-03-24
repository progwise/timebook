/* eslint-disable unicorn/no-null */
import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const trackingCancelMutation = gql`
  mutation trackingCancel {
    trackingCancel {
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
    },
  })
})

it('should throw error when user is unauthorized', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({ query: trackingCancelMutation })
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  expect(response.data).toEqual({ trackingCancel: null })
})

it('should return null when there is no ongoing tracking', async () => {
  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingCancelMutation })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({ trackingCancel: null })
})

it('should stop the ongoing tracking', async () => {
  await prisma.tracking.create({ data: { userId: '1', taskId: 'T1' } })

  const testServer = getTestServer({ userId: '1' })
  const response = await testServer.executeOperation({ query: trackingCancelMutation })
  expect(response.errors).toBeUndefined()
  expect(response.data).toEqual({ trackingCancel: { start: expect.any(Date), task: { id: 'T1', title: 'Task 1' } } })

  expect(await prisma.tracking.count()).toBe(0)
})
