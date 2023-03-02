import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const workHourCreateMutation = gql`
  mutation workHourCreateMutation($data: WorkHourInput!) {
    workHourCreate(data: $data) {
      id
      date
      duration
      user {
        id
        name
      }
      task {
        id
        title
      }
    }
  }
`
describe('workHourCreateMutationField', () => {
  beforeEach(async () => {
    await prisma.workHour.deleteMany()
    await prisma.user.deleteMany()
    await prisma.project.deleteMany()

    await prisma.user.createMany({
      data: [
        {
          id: '1',
          name: 'Test User with project membership',
        },
        {
          id: '2',
          name: 'Test User without project membership',
        },
      ],
    })

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

  it('should throw error when unauthorized', async () => {
    const testServer = getTestServer({ noSession: true })
    const response = await testServer.executeOperation({
      query: workHourCreateMutation,
      variables: {
        data: {
          date: '2022-01-01',
          duration: 120,
          taskId: 'T1',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should throw an error when user is not project member', async () => {
    const testServer = getTestServer({ userId: '2' })
    const response = await testServer.executeOperation({
      query: workHourCreateMutation,
      variables: {
        data: {
          date: '2022-01-01',
          duration: 120,
          taskId: 'T1',
        },
      },
    })
    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should create a new work hour', async () => {
    const testServer = getTestServer()
    const response = await testServer.executeOperation({
      query: workHourCreateMutation,
      variables: {
        data: {
          date: '2022-01-01',
          duration: 120,
          taskId: 'T1',
        },
      },
    })

    expect(response.data).toEqual({
      workHourCreate: {
        id: expect.any(String),
        date: '2022-01-01',
        duration: 120,
        task: {
          id: 'T1',
          title: 'Task 1',
        },
        user: {
          id: '1',
          name: 'Test User with project membership',
        },
      },
    })
    expect(response.errors).toBeUndefined()
  })

  it('should add a work hours if already existed', async () => {
    await prisma.workHour.create({
      data: {
        date: new Date('2022-01-01'),
        duration: 1,
        taskId: 'T1',
        userId: '1',
      },
    })

    const testServer = getTestServer()
    const response = await testServer.executeOperation({
      query: workHourCreateMutation,
      variables: {
        data: {
          date: '2022-01-01',
          duration: 120,
          taskId: 'T1',
        },
      },
    })

    expect(response.data).toEqual({
      workHourCreate: {
        id: expect.any(String),
        date: '2022-01-01',
        duration: 121,
        task: {
          id: 'T1',
          title: 'Task 1',
        },
        user: {
          id: '1',
          name: 'Test User with project membership',
        },
      },
    })
    expect(response.errors).toBeUndefined()
  })
})
