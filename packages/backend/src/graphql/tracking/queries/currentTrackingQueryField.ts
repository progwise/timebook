import { builder } from '../../builder'
import { prisma } from '../../prisma'

export const currentTrackingQueryField = builder.queryField('currentTracking', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Tracking',
    nullable: true,
    resolve: (query, _source, _arguments, context) =>
      prisma.tracking.findUnique({
        ...query,
        where: { userId: context.session.user.id },
      }),
  }),
)
