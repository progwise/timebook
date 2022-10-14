import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('teamBySlug', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Team',
    description: 'Return a team by a slug',
    args: {
      slug: t.arg.string({ description: 'slug of the team' }),
    },
    authScopes: (_source, { slug }) => ({ isTeamMemberByTeamSlug: slug }),
    resolve: (query, _source, { slug }) => prisma.team.findUniqueOrThrow({ ...query, where: { slug } }),
  }),
)
