import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const workHourCreateMutation = `
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
              createMany: {
                data: [
                  {
                    id: '1',
                    title: 'Task',
                  },
                  {
                    id: '2',
                    title: 'Task 2',
                  },
                ],
              },
            },
            projectMemberships: {
              createMany: { data: [{ userId: '1' }] },
            },
          },
        }
      },
    })

    await prisma.workHour.create({
      data: {
        date: new Date('2022-01-01'),
        duration: 1,
        taskId: '2',
        userId: '1'
      }
    })
  })

  it('should throw error when unauthorized', async () => {
    const testServer = getTestServer({ prisma, noSession: true, teamSlug: 'progwise' })
    const response = await testServer.executeOperation({
      query: workHourCreateMutation,
      variables: {
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

  it('should throw error when task belongs to a different team', async () => {
    const testServer = getTestServer({ prisma, teamSlug: 'google' })
    const response = await testServer.executeOperation({
      query: workHourCreateMutation,
      variables: {
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

  it('should throw an error when user is not project member', async () => {
    const testServer = getTestServer({ prisma, teamSlug: 'progwise', userId: '2' })
    const response = await testServer.executeOperation({
      query: workHourCreateMutation,
      variables: {
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

  it('should create a new work hour', async () => {
    const testServer = getTestServer({ prisma, teamSlug: 'progwise' })
    const response = await testServer.executeOperation({
      query: workHourCreateMutation,
      variables: {
        data: {
          date: '2022-01-01',
          duration: 120,
          taskId: '1',
        },
      },
    })

    expect(response.data).toEqual({
      workHourCreate: {
        id: expect.any(String),
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

  it('should add a work hours if already existed', async () => {
    const testServer = getTestServer({ prisma, teamSlug: 'progwise' })
    const response = await testServer.executeOperation({
      query: workHourCreateMutation,
      variables: {
        data: {
          date: '2022-01-01',
          duration: 120,
          taskId: '2',
        },
      },
    })

    expect(response.data).toEqual({
      workHourCreate: {
        id: expect.any(String),
        date: '2022-01-01',
        duration: 121,
        task: {
          id: '2',
          title: 'Task 2',
        },
        user: {
          id: '1',
          name: 'Test User 1',
        },
      },
    })
    expect(response.errors).toBeUndefined()
  })
})
