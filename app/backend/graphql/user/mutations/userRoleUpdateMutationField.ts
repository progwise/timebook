import { idArg, mutationField } from 'nexus'
import { Role } from '../role'

import { User } from '..'
import { isTeamAdmin } from '../../isTeamAdmin'

export const userRoleUpdateMutationField = mutationField('userRoleUpdate', {
  type: User,
  description: 'Update a user role',
  args: {
    userId: idArg({ description: 'Id of the user' }),
    role: Role,
  },
  authorize: async (_source, {}, context) => isTeamAdmin(context),
  resolve: async (_source, { role, userId }, context) => {
    if (!context.session?.user) {
      throw new Error('not authenticated')
    }

    if (userId === context.session.user.id) {
      throw new Error('cant update own role')
    }

    const team = await context.prisma.team.findUnique({
      where: { slug: context.teamSlug },
      rejectOnNotFound: true,
    })

    try {
      const teamMembership = await context.prisma.teamMembership.update({
        where: { userId_teamId: { teamId: team.id, userId: userId } },
        data: { role },
        include: { user: true },
      })
      return teamMembership.user
    } catch {
      throw new Error('user not found in team')
    }
  },
})
