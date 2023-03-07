import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('workHourDelete', (t) =>
  t.prismaField({
    type: 'WorkHour',
    description: 'Delete a work hour entry',
    args: {
      id: t.arg.id({ description: 'id of the workHour item' }),
    },
    authScopes: async (_source, { id }) => {
      const workHour = await prisma.workHour.findUniqueOrThrow({
        select: { userId: true, taskId: true },
        where: { id: id.toString() },
      })

      return {
        isTaskAdmin: workHour.taskId,
        hasUserId: workHour.userId,
      }
    },
    resolve: (query, _source, { id }) => prisma.workHour.delete({ ...query, where: { id: id.toString() } }),
  }),
)
