import { gql } from 'apollo-server-core'

import { PrismaClient } from '@progwise/timebook-prisma'

import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const teamsQuery = gql`
  query teams($includeArchived: Boolean) {
    teams(includeArchived: $includeArchived) {
      id
      title
      slug
      archived
    }
  }
`

describe('teamsQueryField', () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: {
        id: '1',
        name: 'Test User',
      },
    })
    await prisma.team.create({
      data: { id: 'team1', title: 'Team with admin membership', slug: 'team1' },
    })
    await prisma.team.create({
      data: { id: 'team2', title: 'Team with user membership', slug: 'team2' },
    })
    await prisma.team.create({
      data: { id: 'team3', title: 'Team with no membership', slug: 'team3' },
    })
    await prisma.team.create({
      data: { id: 'team4', title: 'Team with archive at date', slug: 'team4', archivedAt: new Date() },
    })
    await prisma.teamMembership.create({
      data: {
        id: '1_1',
        role: 'ADMIN',
        userId: '1',
        teamId: 'team1',
      },
    })
    await prisma.teamMembership.create({
      data: {
        id: '1_2',
        role: 'MEMBER',
        userId: '1',
        teamId: 'team2',
      },
    })
    await prisma.teamMembership.create({
      data: {
        id: '1_4',
        role: 'MEMBER',
        userId: '1',
        teamId: 'team4',
      },
    })
  })

  it('should return teams where the user is member of', async () => {
    const testServer = getTestServer()
    const response = await testServer.executeOperation({ query: teamsQuery })
    expect(response.data?.teams.length).toBe(2)
    expect(response.data?.teams[0].id).toBe('team1')
    expect(response.data?.teams[1].id).toBe('team2')
  })

  it('should be able to query archived teams', async () => {
    const testServer = getTestServer()
    const response = await testServer.executeOperation({ query: teamsQuery, variables: { includeArchived: true } })

    expect(response.data).toEqual({
      teams: [
        {
          id: 'team1',
          title: 'Team with admin membership',
          slug: 'team1',
          archived: false,
        },
        {
          id: 'team2',
          title: 'Team with user membership',
          slug: 'team2',
          archived: false,
        },
        {
          id: 'team4',
          title: 'Team with archive at date',
          slug: 'team4',
          archived: true,
        },
      ],
    })
    expect(response.errors).toBeUndefined()
  })

  it('should not return error when teamSlug does not exists', async () => {
    const testServer = getTestServer()
    const response = await testServer.executeOperation({ query: teamsQuery })

    expect(response.data).not.toBeNull()
    expect(response.data?.teams.length).toBe(2)
  })
})
