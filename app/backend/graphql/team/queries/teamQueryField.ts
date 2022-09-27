import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('team', (t) =>
  t.withAuth({ isTeamMember: true }).prismaField({
    type: 'Team',
    description: 'Return team by slug provided in the api route (/api/[teamSlug]/graphql)',
    resolve: (query, _source, _arguments, context) =>
      prisma.team.findUniqueOrThrow({
        ...query,
        where: { slug: context.teamSlug },
      }),
  }),
)
