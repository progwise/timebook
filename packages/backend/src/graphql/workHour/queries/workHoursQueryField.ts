import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { DateScalar } from '../../scalars'

builder.queryField('workHours', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: ['WorkHour'],
    description: 'Returns a list of work hours for a given time period and a list of users',
    args: {
      from: t.arg({ type: DateScalar, description: 'Start of the time period' }),
      to: t.arg({
        type: DateScalar,
        required: false,
        description: 'End of the time period. If not provided the from arg is used as the end.',
      }),
      userIds: t.arg.idList({
        required: false,
        description: 'List of user ids. If not provided only the work hours of the current users are returned.',
      }),
    },
    resolve: (query, _source, { from, to, userIds }, context) =>
      prisma.workHour.findMany({
        ...query,
        where: {
          task: {
            project: {
              projectMemberships: {
                some: { userId: context.session.user.id },
              },
            },
          },
          userId: { in: userIds?.map((id) => id.toString()) ?? [context.session.user.id] },
          date: {
            gte: from,
            lte: to ?? from,
          },
        },
      }),
  }),
)
