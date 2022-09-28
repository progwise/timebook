import { PrismaClient } from '@prisma/client'
import { GraphQLError } from 'graphql'
import { getTestServer } from '../../../getTestServer'

const prisma = new PrismaClient()

const userCapacityUpdateMutation = `
mutation userCapacityUpdate($userId: ID!, $capacityHours: Float!) {
    userCapacityUpdate(userId: $userId, capacityHours: $capacityHours) {
    id
    capacityHours
  }
}
`

describe('userCapatityUpdate', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany()
    await prisma.team.deleteMany()
    await prisma.teamMembership.deleteMany()
  })

  it('should be error when update capacity hours', async () => {
    await prisma.team.create({ data: { slug: 'progwise', id: '1', title: 'Progwise' } })
    await prisma.user.create({ data: { id: '1' } })
    await prisma.teamMembership.create({ data: { role: 'MEMBER', teamId: '1', userId: '1' } })

    const testServer = getTestServer({ prisma, teamSlug: 'progwise' })

    const response = await testServer.executeOperation({
      query: userCapacityUpdateMutation,
      variables: {
        userId: '1',
        capacityHours: 1,
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('Not authorized')])
  })

  it('should be update capacity hours', async () => {
    await prisma.team.create({ data: { slug: 'progwise', id: '1', title: 'Progwise' } })
    await prisma.user.create({ data: { id: '1' } })
    await prisma.teamMembership.create({ data: { role: 'ADMIN', teamId: '1', userId: '1' } })
    await prisma.user.create({ data: { id: '2' } })
    await prisma.teamMembership.create({ data: { role: 'MEMBER', teamId: '1', userId: '2' } })

    const testServer = getTestServer({ prisma, teamSlug: 'progwise', userId: '1' })
    const response = await testServer.executeOperation({
      query: userCapacityUpdateMutation,
      variables: {
        userId: '2',
        capacityHours: 3,
      },
    })

    expect(response.data).toEqual({ userCapacityUpdate: { id: '2', capacityHours: 3 } })
    expect(response.errors).toBeUndefined()
  })

  it('should throw error if user is not teamMember', async () => {
    await prisma.team.create({ data: { slug: 'progwise', id: '1', title: 'Progwise' } })
    await prisma.user.create({ data: { id: '1' } })
    await prisma.teamMembership.create({ data: { role: 'ADMIN', teamId: '1', userId: '1' } })
    await prisma.user.create({ data: { id: '2' } })

    const testServer = getTestServer({ prisma, teamSlug: 'progwise', userId: '1' })
    const response = await testServer.executeOperation({
      query: userCapacityUpdateMutation,
      variables: {
        userId: '2',
        capacityHours: 3,
      },
    })

    expect(response.data).toBeNull()
    expect(response.errors).toEqual([new GraphQLError('user not found in team')])
  })
})
