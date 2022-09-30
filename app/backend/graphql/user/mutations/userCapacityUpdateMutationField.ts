import { floatArg, idArg, mutationField } from 'nexus'
import { User } from '../user'
import { isTeamAdmin } from '../../isTeamAdmin'

export const userCapacityUpdateMutationField = mutationField('userCapacityUpdate', {
  type: User,
  description: 'Updated a user capacity hours',
  args: {
    userId: idArg({ description: 'Id of the user' }),
    capacityMinutes: floatArg({ description: 'Capacity of minutes' }),
  },
  authorize: async (_source, {}, context) => isTeamAdmin(context),
  resolve: async (_source, { userId, capacityMinutes }, context) => {
    const team = await context.prisma.team.findUniqueOrThrow({
      where: { slug: context.teamSlug },
    })

    try {
      const teamMembership = await context.prisma.teamMembership.update({
        where: { userId_teamId: { teamId: team.id, userId: userId } },
        data: { capacityMinutes },
        include: { user: true },
      })

      return teamMembership.user
    } catch {
      throw new Error('user not found in team')
    }
  },
})
