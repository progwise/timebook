import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const workHourUpdateMutation = gql`
  mutation workHourUpdateMutation($data: WorkHourInput!, $date: Date!, $taskId: ID!) {
    workHourUpdate(data: $data, date: $date, taskId: $taskId) {
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

describe('workHourUpdateMutationField', () => {
  beforeEach(async () => {
    await prisma.report.deleteMany()
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
    await prisma.project.create({
      data: {
        id: 'P2',
        title: 'Project without members',
        tasks: {
          create: {
            id: 'T2',
            title: 'Task 2',
          },
        },
      },
    })
  })

  it('should throw error when unauthorized', async () => {
    const testServer = getTestServer({ noSession: true })
    const response = await testServer.executeOperation({
      query: workHourUpdateMutation,
      variables: {
        data: {
          date: '2022-01-01',
          duration: 120,
          taskId: 'T1',
        },
        date: '2022-01-01',
        taskId: 'T1',
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should update own work hour', async () => {
    await prisma.workHour.create({
      data: {
        date: new Date('2022-01-01'),
        duration: 1,
        userId: '1',
        taskId: 'T1',
      },
    })

    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: workHourUpdateMutation,
      variables: {
        data: {
          date: '2022-01-02',
          duration: 60,
          taskId: 'T1',
        },
        date: '2022-01-01',
        taskId: 'T1',
      },
    })

    expect(response.data).toEqual({
      workHourUpdate: {
        date: '2022-01-02',
        duration: 60,
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

    const oldWorkHour = await prisma.workHour.findUnique({
      where: { date_userId_taskId: { date: new Date('2022-01-01'), taskId: 'T1', userId: '1' } },
    })
    expect(oldWorkHour).toBeNull() // old work hour is set to new date and should therefore not exist anymore
  })

  it('should throw error when user has no project membership', async () => {
    const testServer = getTestServer({ userId: '2' })
    const response = await testServer.executeOperation({
      query: workHourUpdateMutation,
      variables: {
        data: {
          date: '2022-01-01',
          duration: 120,
          taskId: 'T1',
        },
        date: '2022-01-01',
        taskId: 'T1',
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should throw error when a report is locking the previous work hour', async () => {
    await prisma.report.create({ data: { year: 2022, month: 0, projectId: 'P1', userId: '1' } })

    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: workHourUpdateMutation,
      variables: {
        data: {
          date: '2023-02-01',
          duration: 120,
          taskId: 'T1',
        },
        date: '2022-01-01',
        taskId: 'T1',
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('project is locked by report')])
  })

  it('should throw error when a report is locking the new date', async () => {
    await prisma.report.create({ data: { year: 2023, month: 1, projectId: 'P1', userId: '1' } })

    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: workHourUpdateMutation,
      variables: {
        data: {
          date: '2023-02-01',
          duration: 120,
          taskId: 'T1',
        },
        date: '2022-01-01',
        taskId: 'T1',
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('project is locked by report')])
  })

  it('should create a new work hour if not exist', async () => {
    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: workHourUpdateMutation,
      variables: {
        data: {
          date: '2022-07-03',
          duration: 60,
          taskId: 'T1',
        },
        date: '2022-07-03',
        taskId: 'T1',
      },
    })

    expect(response.data).toEqual({
      workHourUpdate: {
        date: '2022-07-03',
        duration: 60,
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

  it('should throw an error when moving a work hour to a foreign project', async () => {
    await prisma.workHour.create({
      data: {
        date: new Date('2022-01-01'),
        duration: 1,
        userId: '1',
        taskId: 'T1',
      },
    })

    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: workHourUpdateMutation,
      variables: {
        data: {
          date: '2022-01-01',
          duration: 120,
          taskId: 'T2',
        },
        date: '2022-01-01',
        taskId: 'T1',
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })
})
