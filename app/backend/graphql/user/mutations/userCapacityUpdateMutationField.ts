import { intArg, idArg, mutationField } from 'nexus'
import { User } from '../user'
import { isTeamAdmin } from '../../isTeamAdmin'

export const userCapacityUpdateMutationField = mutationField('userCapacityUpdate', {
  type: User,
  description: 'Updates the user capacity hours',
  args: {
    userId: idArg({ description: 'Id of the user' }),
    availableMinutesPerWeek: intArg({ description: 'Capacity of minutes' }),
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
