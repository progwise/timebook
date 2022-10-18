import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const teamBySlugQuery = `
  query teamBySlug($teamSlug: String!) {
    teamBySlug(slug: $teamSlug) {
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

describe('teamBySlugQueryField', () => {
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

  it('should return error when teamSlug does not exists', async () => {
    const testServer = getTestServer()
    const response = await testServer.executeOperation({
      query: teamBySlugQuery,
      variables: { teamSlug: 'unknownSlug' },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should return error when user is not team member', async () => {
    const testServer = getTestServer()
    const response = await testServer.executeOperation({ query: teamBySlugQuery, variables: { teamSlug: 'emptyTeam' } })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should return team when user is member of', async () => {
    const testServer = getTestServer()
    const response = await testServer.executeOperation({ query: teamBySlugQuery, variables: { teamSlug: 'progwise' } })

    expect(response.data).toEqual({
      teamBySlug: {
        id: '1',
        title: 'Progwise',
        canModify: true,
        members: [{ id: '1', name: 'Test User', role: 'ADMIN' }],
      },
    })
    expect(response.errors).toBeUndefined()
  })
})
