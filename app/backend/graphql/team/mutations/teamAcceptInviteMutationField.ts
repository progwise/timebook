import { mutationField, stringArg } from 'nexus'
import { Team } from '../team'

export const teamAcceptInviteMutationField = mutationField('teamAcceptInvite', {
  type: Team,
  description: 'Accept an invite to a team',
  args: {
    inviteKey: stringArg({ description: 'Invite key of the team' }),
  },
  authorize: (_source, _arguments, context) => !!context.session?.user,
  resolve: async (_source, { inviteKey }, context) => {
    if (!context.session?.user) {
      throw new Error('not authenticated')
    }
    // Does membership already exists?
    const team = await context.prisma.teamMembership
      .findFirst({
        where: {
          userId: context.session.user.id,
          team: { inviteKey },
        },
      })
      .team()

    if (team) {
      return team
    }

    // Create new membership
    return context.prisma.team.update({
      where: { inviteKey },
      data: {
        teamMemberships: {
          create: { userId: context.session.user.id },
        },
      },
    })
  },
})
