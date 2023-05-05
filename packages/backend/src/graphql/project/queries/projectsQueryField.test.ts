/* eslint-disable unicorn/no-null */
import { gql } from 'apollo-server-core'
import { format } from 'date-fns'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const projectsQuery = gql`
  query projects(
    $from: Date!
    $includePastMembers: Boolean
    $includeProjectsWhereUserBookedWorkHours: Boolean! = false
  ) {
    projects(from: $from, includeProjectsWhereUserBookedWorkHours: $includeProjectsWhereUserBookedWorkHours) {
      id
      title
      startDate
      endDate
      isProjectMember
      members(includePastMembers: $includePastMembers) @skip(if: $includeProjectsWhereUserBookedWorkHours) {
        id
        name
      }
      tasks {
        id
        title
      }
    }
  }
`

beforeEach(async () => {
  await prisma.workHour.deleteMany()
  await prisma.user.deleteMany()
  await prisma.project.deleteMany()

  await prisma.user.createMany({
    data: [
      { id: '1', name: 'user with project membership' },
      { id: '2', name: 'user without project membership who booked on project' },
      { id: '3', name: 'user without project membership' },
    ],
  })

  await prisma.project.create({
    data: {
      id: 'P1',
      title: 'Project 1',
      tasks: {
        createMany: {
          data: [
            { id: 'T1', title: 'Task 1' },
            { id: 'T2', title: 'Task 2' },
          ],
        },
      },
      projectMemberships: { create: { userId: '1' } },
    },
  })

  await prisma.workHour.create({ data: { date: new Date(), userId: '2', duration: 60, taskId: 'T1' } })
})

it('should throw error when not signed in', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({ query: projectsQuery, variables: { from: '2023-01-01' } })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
})

describe('projects where the user is no longer member of', () => {
  it('should return projects where the user booked work hours but is no longer member of', async () => {
    const testServer = getTestServer({ userId: '2' })
    const from = format(new Date(), 'yyyy-MM-dd')

    const response = await testServer.executeOperation({
      query: projectsQuery,
      variables: { from, includeProjectsWhereUserBookedWorkHours: true },
    })

    expect(response.errors).toBeUndefined()
    expect(response.data?.projects).toHaveLength(1)
  })

  it('should return only the tasks where the user booked work hours', async () => {
    const testServer = getTestServer({ userId: '2' })
    const from = format(new Date(), 'yyyy-MM-dd')

    const response = await testServer.executeOperation({
      query: projectsQuery,
      variables: { from, includeProjectsWhereUserBookedWorkHours: true },
    })

    expect(response.data?.projects.at(0)?.tasks).toEqual([{ id: 'T1', title: 'Task 1' }])
  })

  it('should not return projects where the user booked work hours but is no longer member of when it was not booked in the given time frame', async () => {
    const testServer = getTestServer({ userId: '2' })

    const response = await testServer.executeOperation({
      query: projectsQuery,
      variables: { from: '2000-01-01', includeProjectsWhereUserBookedWorkHours: true },
    })

    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({ projects: [] })
  })
})

describe('members', () => {
  it('should return all members of the project', async () => {
    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: projectsQuery,
      variables: { from: '2023-01-01' },
    })

    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      projects: [
        {
          id: 'P1',
          title: 'Project 1',
          startDate: null,
          endDate: null,
          isProjectMember: true,
          members: [{ id: '1', name: 'user with project membership' }],
          tasks: expect.any(Array),
        },
      ],
    })
  })

  it('should return all members + members who booked work hours when includePastMembers=true', async () => {
    const testServer = getTestServer({ userId: '1' })
    const response = await testServer.executeOperation({
      query: projectsQuery,
      variables: { from: '2023-01-01', includePastMembers: true },
    })

    expect(response.errors).toBeUndefined()
    expect(response.data).toEqual({
      projects: [
        {
          id: 'P1',
          title: 'Project 1',
          startDate: null,
          endDate: null,
          isProjectMember: true,
          members: [
            { id: '2', name: 'user without project membership who booked on project' },
            { id: '1', name: 'user with project membership' },
          ],
          tasks: expect.any(Array),
        },
      ],
    })
  })
})
