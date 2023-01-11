/* eslint-disable unicorn/no-null */
import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { DateScalar } from '../../scalars'

builder.queryField('projects', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: ['Project'],
    description: 'Returns all project of the signed in user that are active',
    args: {
      from: t.arg({ type: DateScalar, required: true }),
      to: t.arg({ type: DateScalar, required: false }),
    },
    resolve: (query, _source, { from, to }, context) =>
      prisma.project.findMany({
        ...query,
        where: {
          AND: [
            {
              OR: [
                {
                  startDate: {
                    lte: to ?? from,
                  },
                },
                {
                  startDate: {
                    equals: null,
                  },
                },
              ],
            },
            {
              OR: [
                {
                  endDate: {
                    gte: from,
                  },
                },
                {
                  endDate: {
                    equals: null,
                  },
                },
              ],
            },
          ],
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
