import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { migrateTrackingToWorkHours } from './migrateTrackingToWorkHour'

export const trackingStopMutationField = builder.mutationField('trackingStop', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: ['WorkHour'],
    description: 'The ongoing time tracking will be stopped and converted to work hours',
    resolve: async (query, _source, _arguments, context) => {
      const currentTracking = await prisma.tracking.findUnique({ where: { userId: context.session.user.id } })

      if (!currentTracking) {
        return []
      }

      return migrateTrackingToWorkHours(currentTracking, query)
    },
  }),
)
