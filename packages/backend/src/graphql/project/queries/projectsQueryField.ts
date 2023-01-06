import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('projects', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: ['Project'],
    description: 'Returns all project of the signed in user',
    args: {},
    resolve: (query, _source, info, context) =>
      prisma.project.findMany({
        ...query,
        where: {
          projectMemberships: {
            some: {
              userId: context.session.user.id,
            },
          },
        },
        orderBy: { title: 'asc' },
      }),
  }),
)
