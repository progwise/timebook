import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('userCapacityUpdate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'User',
    description: 'Updates the user capacity minutes',
    args: {
      userId: t.arg.id({ description: 'Id of the user' }),
      availableMinutesPerWeek: t.arg.int({ description: 'Capacity of minutes', required: false }),
      teamSlug: t.arg.string({ description: 'slug of the team' }),
    },
    authScopes: (_source, { teamSlug }) => ({ isTeamAdminByTeamSlug: teamSlug }),
    resolve: async (query, _source, { userId, availableMinutesPerWeek, teamSlug }) => {
      const team = await prisma.team.findUniqueOrThrow({
        where: { slug: teamSlug },
      })

      try {
        const teamMembership = await prisma.teamMembership.update({
          where: { userId_teamId: { teamId: team.id, userId: userId.toString() } },
          data: { availableMinutesPerWeek },
          select: { user: query },
        })

        return teamMembership.user
      } catch {
        throw new Error('user not found in team')
      }
    },
  }),
)
