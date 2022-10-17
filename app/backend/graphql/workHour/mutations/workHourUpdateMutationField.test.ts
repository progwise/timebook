import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const workHourUpdateMutation = `
  mutation workHourUpdateMutation($id: ID!, $data: WorkHourInput!) {
    workHourUpdate(id: $id, data: $data) {
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

describe('workHourUpdateMutationField', () => {
  beforeEach(async () => {
    await prisma.workHour.deleteMany()
    await prisma.user.deleteMany()
    await prisma.project.deleteMany()
    await prisma.team.deleteMany()

    await prisma.user.createMany({
      data: [
        {
          id: '1',
          name: 'Test User 1',
        },
        {
          id: '2',
          name: 'Test User 2',
        },
      ],
    })

    await prisma.team.create({
      data: {
        id: '1',
        slug: 'progwise',
        title: 'Progwise',
        teamMemberships: {
          createMany: {
            data: [
              {
                id: '1',
                userId: '1',
                role: 'ADMIN',
              },
              {
                id: '2',
                userId: '2',
                role: 'MEMBER',
              },
            ],
          },
        },
        projects: {
          create: {
            title: 'Project',
            tasks: {
              create: {
                id: '1',
                title: 'Task',
                workHours: {
                  createMany: {
                    data: [
                      { id: '1', date: new Date('2022-01-01'), duration: 120, userId: '1' },
                      { id: '2', date: new Date('2022-01-01'), duration: 120, userId: '2' },
                    ],
                  },
                },
              },
            },
            projectMemberships: {
              createMany: { data: [{ userId: '1' }] },
            },
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
        id: '1',
        data: {
          date: '2022-01-01',
          duration: 120,
          taskId: '1',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should update own work hour', async () => {
    const testServer = getTestServer()
    const response = await testServer.executeOperation({
      query: workHourUpdateMutation,
      variables: {
        id: '1',
        data: {
          date: '2022-01-02',
          duration: 60,
          taskId: '1',
        },
      },
    })

    expect(response.data).toEqual({
      workHourUpdate: {
        id: '1',
        date: '2022-01-02',
        duration: 60,
        task: {
          id: '1',
          title: 'Task',
        },
        user: {
          id: '1',
          name: 'Test User 1',
        },
      },
    })
    expect(response.errors).toBeUndefined()
  })

  it('should throw error when updating work hour from another user', async () => {
    const testServer = getTestServer({ userId: '2' })
    const response = await testServer.executeOperation({
      query: workHourUpdateMutation,
      variables: {
        id: '1',
        data: {
          date: '2022-01-01',
          duration: 120,
          taskId: '1',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should update any work hour when user is admin of the same team', async () => {
    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: workHourUpdateMutation,
      variables: {
        id: '1',
        data: {
          date: '2022-01-01',
          duration: 120,
          taskId: '1',
        },
      },
    })

    expect(response.data).toEqual({
      workHourUpdate: {
        id: '1',
        date: '2022-01-01',
        duration: 120,
        task: {
          id: '1',
          title: 'Task',
        },
        user: {
          id: '1',
          name: 'Test User 1',
        },
      },
    })
    expect(response.errors).toBeUndefined()
  })

  it('should throw error when user books on a different project without membership', async () => {
    const testServer = getTestServer({ userId: '2' })
    const response = await testServer.executeOperation({
      query: workHourUpdateMutation,
      variables: {
        id: '1',
        data: {
          date: '2022-01-01',
          duration: 120,
          taskId: '1',
        },
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })
})
