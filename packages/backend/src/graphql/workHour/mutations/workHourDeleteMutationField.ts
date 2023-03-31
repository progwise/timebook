import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { isProjectLocked } from './isProjectLocked'

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
        isAdminByTask: workHour.taskId,
        hasUserId: workHour.userId,
      }
    },
    resolve: async (query, _source, { id }) => {
      const workHour = await prisma.workHour.findUniqueOrThrow({
        select: { task: { select: { projectId: true } }, userId: true, date: true },
        where: { id: id.toString() },
      })

      if (
        await isProjectLocked({
          projectId: workHour.task.projectId,
          date: workHour.date,
        })
      ) {
        throw new Error('project is locked for the given month')
      }

      return prisma.workHour.delete({ ...query, where: { id: id.toString() } })
    },
  }),
)
