/* eslint-disable unicorn/no-null */
import { gql } from 'apollo-server-core'
import { GraphQLError } from 'graphql'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const projectsQuery = gql`
  query projects($from: Date!, $includePastMembers: Boolean) {
    projects(from: $from) {
      id
      title
      startDate
      endDate
      members(includePastMembers: $includePastMembers) {
        id
        name
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
        create: {
          id: 'T1',
          title: 'Task 1',
          workHours: { create: { date: new Date(), userId: '2', duration: 60 } },
        },
      },
      projectMemberships: { create: { userId: '1' } },
    },
  })
})

it('should throw error when not signed in', async () => {
  const testServer = getTestServer({ noSession: true })
  const response = await testServer.executeOperation({ query: projectsQuery, variables: { from: '2023-01-01' } })

  expect(response.data).toBeNull()
  expect(response.errors).toEqual([new GraphQLError('Not authorized')])
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
          members: [{ id: '1', name: 'user with project membership' }],
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
          members: [
            { id: '2', name: 'user without project membership who booked on project' },
            { id: '1', name: 'user with project membership' },
          ],
        },
      ],
    })
  })
})
