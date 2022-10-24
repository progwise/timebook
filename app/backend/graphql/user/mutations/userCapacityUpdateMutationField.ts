import { isTeamAdmin } from '../../isTeamAdmin'
import { User } from '../user'
import { intArg, idArg, mutationField, nullable } from 'nexus'

export const userCapacityUpdateMutationField = mutationField('userCapacityUpdate', {
  type: User,
  description: 'Updates the user capacity minutes',
  args: {
    userId: idArg({ description: 'Id of the user' }),
    availableMinutesPerWeek: nullable(intArg({ description: 'Capacity of minutes' })),
  },
  authorize: async (_source, {}, context) => isTeamAdmin(context),
  resolve: async (_source, { userId, availableMinutesPerWeek }, context) => {
    const team = await context.prisma.team.findUniqueOrThrow({
      where: { slug: context.teamSlug },
    })

    try {
      const teamMembership = await context.prisma.teamMembership.update({
        where: { userId_teamId: { teamId: team.id, userId: userId } },
        data: { availableMinutesPerWeek },
        include: { user: true },
      })

      return teamMembership.user
    } catch {
      throw new Error('user not found in team')
    }
  },
})
