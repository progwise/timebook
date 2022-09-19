import { queryField, stringArg } from 'nexus'
import { Team } from '../team'
import { isTeamMember } from '../utils'

export const teamBySlugQueryField = queryField('teamBySlug', {
  type: Team,
  description: 'Return a team by a slug',
  args: {
    slug: stringArg({ description: 'slug of the team' }),
  },
  authorize: (_source, { slug }, context) => isTeamMember({ slug }, context),
  resolve: (_source, { slug }, context) =>
    context.prisma.team.findUniqueOrThrow({
      where: { slug },
    }),
})
