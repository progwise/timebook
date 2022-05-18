import { PrismaClient, Team } from '@prisma/client'
import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const teamsQuery = `
  query teams {
    teams {
      id
      title
      slug
      projects {
        id
        title
      }
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
    await prisma.project.create({ data: { id: 'project1', title: 'Project 1', teamId: 'team1' } })
    await prisma.project.create({ data: { id: 'project2', title: 'Project 2', teamId: 'team1' } })
    await prisma.projectMembership.create({ data: { userId: '1', projectId: 'project2' } })
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
  })

  it('should return teams where the user is member of', async () => {
    const testServer = getTestServer({ prisma, teamSlug: undefined })
    const response = await testServer.executeOperation({ query: teamsQuery })
    expect(response.data?.teams.length).toBe(2)
    expect(response.data?.teams[0].id).toBe('team1')
    expect(response.data?.teams[1].id).toBe('team2')
  })

  it('should not return error when teamSlug does not exists', async () => {
    const testServer = getTestServer({ prisma, teamSlug: 'unknownSlug' })
    const response = await testServer.executeOperation({ query: teamsQuery })

    expect(response.data).not.toBeNull()
    expect(response.data?.teams.length).toBe(2)
  })

  it('should return projects the user can access', async () => {
    const testServer = getTestServer({ prisma, teamSlug: undefined })
    const response = await testServer.executeOperation({ query: teamsQuery })

    const team1 = response.data?.teams.find((team: Team) => team.id === 'team1')
    expect(team1).not.toBeNull()
    expect(team1.projects).toHaveLength(1)
    expect(team1.projects[0].id).toBe('project2')
  })
})
