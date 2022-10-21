import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { WorkHourInput } from '../workHourInput'

builder.mutationField('workHourCreate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'WorkHour',
    description: 'Create a new WorkHour',
    args: {
      data: t.arg({ type: WorkHourInput }),
    },
    authScopes: async (_source, { data: { taskId } }) => {
      const task = await prisma.task.findUniqueOrThrow({
        select: { projectId: true },
        where: { id: taskId.toString() },
      })

      return { isProjectMember: task.projectId }
    },
    resolve: (query, _source, { data: { date, duration, taskId } }, context) => {
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
