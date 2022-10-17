import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const teamQuery = `
  query team($teamSlug: String!) {
    team {
      id
      title
      canModify
      members {
        id
        name
        role(teamSlug: $teamSlug)
      }
    }
  }
`

describe('teamQueryField', () => {
  beforeAll(async () => {
    await prisma.user.create({
      data: {
        id: '1',
        name: 'Test User',
        teamMemberships: {
          create: {
            team: {
              create: {
                id: '1',
                slug: 'progwise',
                title: 'Progwise',
              },
            },
            role: 'ADMIN',
          },
        },
      },
    })
    await prisma.team.create({
      data: { title: 'Team without members', slug: 'emptyTeam' },
    })
  })

  it('should return error when no teamSlug provided', async () => {
    const testServer = getTestServer({ teamSlug: undefined })
    const response = await testServer.executeOperation({ query: teamQuery, variables: { teamSlug: '' } })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should return error when teamSlug does not exists', async () => {
    const testServer = getTestServer({ teamSlug: 'unknownSlug' })
    const response = await testServer.executeOperation({ query: teamQuery, variables: { teamSlug: 'unknownSlug' } })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should return error when user is not team member', async () => {
    const testServer = getTestServer({ teamSlug: 'emptyTeam' })
    const response = await testServer.executeOperation({ query: teamQuery, variables: { teamSlug: 'emptyTeam' } })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should return team when user is member of', async () => {
    const testServer = getTestServer({ teamSlug: 'progwise' })
    const response = await testServer.executeOperation({ query: teamQuery, variables: { teamSlug: 'progwise' } })

    expect(response.data).toEqual({
      team: {
        id: '1',
        title: 'Progwise',
        canModify: true,
        members: [{ id: '1', name: 'Test User', role: 'ADMIN' }],
      },
    })
    expect(response.errors).toBeUndefined()
  })
})
