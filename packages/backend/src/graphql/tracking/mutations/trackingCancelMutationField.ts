import { builder } from '../../builder'
import { prisma } from '../../prisma'

export const trackingCancelMutationField = builder.mutationField('trackingCancel', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Tracking',
    nullable: true,
    description: 'The ongoing time tracking will be deleted',
    resolve: async (query, _source, _arguments, context) => {
      try {
        return await prisma.tracking.delete({
          ...query,
          where: {
            userId: context.session.user.id,
          },
        })
      } catch {
        // eslint-disable-next-line unicorn/no-null
        return null
      }
    },
  }),
)
