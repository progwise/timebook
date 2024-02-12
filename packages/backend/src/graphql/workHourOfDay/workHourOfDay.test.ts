/* eslint-disable unicorn/no-null */
import { gql } from 'apollo-server-core'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../getTestServer'

const prisma = new PrismaClient()
const testServer = getTestServer()

const projectsQuery = gql`
  query projects {
    projects(from: "2022-12-31", to: "2023-01-01", filter: ALL, includeProjectsWhereUserBookedWorkHours: true) {
      tasks {
        workHourOfDays(from: "2022-12-31", to: "2023-01-01") {
          date
          isLocked
          workHour {
            duration
          }
        }
      }
    }
  }
`
describe('WorkHourOfDay', () => {
  beforeEach(async () => {
    await prisma.lockedMonth.deleteMany()
    await prisma.workHour.deleteMany()
    await prisma.user.deleteMany()
    await prisma.project.deleteMany()

    await prisma.user.createMany({
      data: [
        {
          id: '1',
          name: 'Test User with project membership',
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
        projectMemberships: { create: { userId: '1', role: 'ADMIN' } },
      },
    })
  })

  it('returns locked when task is locked by admin', async () => {
    await prisma.task.update({ where: { id: 'T1' }, data: { isLocked: true } })

    const response = await testServer.executeOperation({ query: projectsQuery })

    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      projects: [
        {
          tasks: [
            {
              workHourOfDays: [
                { date: '2022-12-31', isLocked: true, workHour: null },
                { date: '2023-01-01', isLocked: true, workHour: null },
              ],
            },
          ],
        },
      ],
    })
  })

  it('returns locked when project has not been started', async () => {
    await prisma.project.update({ where: { id: 'P1' }, data: { startDate: new Date('2023-01-01') } })

    const response = await testServer.executeOperation({ query: projectsQuery })

    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      projects: [
        {
          tasks: [
            {
              workHourOfDays: [
                { date: '2022-12-31', isLocked: true, workHour: null },
                { date: '2023-01-01', isLocked: false, workHour: null },
              ],
            },
          ],
        },
      ],
    })
  })

  it('returns locked when project has been ended', async () => {
    await prisma.project.update({ where: { id: 'P1' }, data: { endDate: new Date('2022-12-31') } })

    const response = await testServer.executeOperation({ query: projectsQuery })

    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      projects: [
        {
          tasks: [
            {
              workHourOfDays: [
                { date: '2022-12-31', isLocked: false, workHour: null },
                { date: '2023-01-01', isLocked: true, workHour: null },
              ],
            },
          ],
        },
      ],
    })
  })

  it('returns locked when project is archived', async () => {
    await prisma.project.update({ where: { id: 'P1' }, data: { archivedAt: new Date() } })

    const response = await testServer.executeOperation({ query: projectsQuery })

    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      projects: [
        {
          tasks: [
            {
              workHourOfDays: [
                { date: '2022-12-31', isLocked: true, workHour: null },
                { date: '2023-01-01', isLocked: true, workHour: null },
              ],
            },
          ],
        },
      ],
    })
  })

  it('returns locked when user is no longer a project member', async () => {
    // Create a work hour to make sure the user still sees the project when he is no longer a project member
    await prisma.workHour.create({
      data: {
        date: new Date('2022-12-31'),
        duration: 60,
        userId: '1',
        taskId: 'T1',
      },
    })
    await prisma.projectMembership.delete({ where: { userId_projectId: { projectId: 'P1', userId: '1' } } })

    const response = await testServer.executeOperation({ query: projectsQuery })

    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      projects: [
        {
          tasks: [
            {
              workHourOfDays: [
                { date: '2022-12-31', isLocked: true, workHour: { duration: 60 } },
                { date: '2023-01-01', isLocked: true, workHour: null },
              ],
            },
          ],
        },
      ],
    })
  })

  it('returns locked when project is locked for the month', async () => {
    await prisma.lockedMonth.create({ data: { projectId: 'P1', year: 2022, month: 11 } })

    const response = await testServer.executeOperation({ query: projectsQuery })

    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      projects: [
        {
          tasks: [
            {
              workHourOfDays: [
                { date: '2022-12-31', isLocked: true, workHour: null },
                { date: '2023-01-01', isLocked: false, workHour: null },
              ],
            },
          ],
        },
      ],
    })
  })

  it('returns locked=false', async () => {
    const response = await testServer.executeOperation({ query: projectsQuery })

    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      projects: [
        {
          tasks: [
            {
              workHourOfDays: [
                { date: '2022-12-31', isLocked: false, workHour: null },
                { date: '2023-01-01', isLocked: false, workHour: null },
              ],
            },
          ],
        },
      ],
    })
  })
})
