import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('projects', (t) =>
  t.withAuth({ isTeamMember: true }).prismaField({
    type: ['Project'],
    description: 'Returns a list of all projects',
    resolve: (query, _source, _arguments, context) =>
      prisma.project.findMany({
        ...query,
        orderBy: [{ title: 'asc' }],
        where: {
          team: { slug: context.teamSlug },
          OR: [
            {
              projectMemberships: {
                some: {
                  userId: context.session.user.id,
                },
              },
            },
            {
              team: {
                teamMemberships: {
                  some: {
                    userId: context.session.user.id,
                    role: 'ADMIN',
                  },
                },
              },
            },
          ],
        },
      }),
  }),
)
