import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { WorkHourInput } from '../workHourInput'
import { isProjectLocked } from './isProjectLocked'

builder.mutationField('workHourCreate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'WorkHour',
    description: 'Create a new WorkHour',
    args: {
      data: t.arg({ type: WorkHourInput }),
    },
    authScopes: (_source, { data: { taskId } }) => ({ isMemberByTask: taskId.toString() }),
    resolve: async (query, _source, { data: { date, duration, taskId } }, context) => {
      const task = await prisma.task.findUniqueOrThrow({
        select: { projectId: true, isLocked: true },
        where: { id: taskId.toString() },
      })

      if (task.isLocked) {
        throw new Error('task is locked')
      }

      if (await isProjectLocked({ date, projectId: task.projectId })) {
        throw new Error('project is locked for the given month')
      }

      const workHourKey = {
        date,
        taskId: taskId.toString(),
        userId: context.session.user.id,
      }

      return prisma.workHour.upsert({
        ...query,
        where: { date_userId_taskId: workHourKey },
        create: { ...workHourKey, duration },
        update: { duration: { increment: duration } },
      })
    },
  }),
)
