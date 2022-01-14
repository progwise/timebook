import { ForbiddenError } from 'apollo-server-core'
import { queryField } from 'nexus'
import { Team } from '../team'
import { isTeamMember } from '../utils'

export const teamQueryField = queryField('team', {
  type: Team,
  description: 'Return team by slug provided in the api route (/api/[teamSlug]/graphql)',
  authorize: (_source, _arguments, context) => !!context.teamSlug && isTeamMember({ slug: context.teamSlug }, context),
  resolve: (_source, _arguments, context) => {
    if (!context.teamSlug) {
      throw new ForbiddenError('team not found')
    }

    return context.prisma.team.findUnique({
      where: { slug: context.teamSlug },
      rejectOnNotFound: true,
    })
  },
})
