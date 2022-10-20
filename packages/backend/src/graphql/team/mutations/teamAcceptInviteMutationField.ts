import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('teamAcceptInvite', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Team',
    description: 'Accept an invite to a team',
    args: {
      inviteKey: t.arg.string({ description: 'Invite key of the team' }),
    },
    resolve: async (query, _source, { inviteKey }, context) => {
      // Does membership already exists?
      const teamMembership = await prisma.teamMembership.findFirst({
        include: {
          team: query,
        },
        where: {
          userId: context.session.user.id,
          team: { inviteKey },
        },
      })

      if (teamMembership) {
        return teamMembership.team
      }

      // Create new membership
      return prisma.team.update({
        ...query,
        where: { inviteKey },
        data: {
          teamMemberships: {
            create: { userId: context.session.user.id },
          },
        },
      })
    },
  }),
)
