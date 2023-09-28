import { builder } from '../builder'
import { prisma } from '../prisma'
import { DateScalar } from '../scalars'
import { isProjectLocked } from '../workHour/mutations/isProjectLocked'

export const WorkHourOfDayAndTask = builder.objectType('WorkHourOfDay', {
  fields: (t) => ({
    date: t.expose('date', { type: DateScalar }),
    isLocked: t.field({
      type: 'Boolean',
      resolve: async (workHour) => {
        const isTaskLockedByUser =
          (await prisma.lockedTask.count({
            where: { taskId: workHour.taskId, userId: workHour.userId },
          })) > 0

        if (isTaskLockedByUser) {
          return true
        }

        const task = await prisma.task.findUniqueOrThrow({
          where: { id: workHour.taskId },
          select: {
            isLocked: true,
            project: { select: { id: true, archivedAt: true, startDate: true, endDate: true } },
          },
        })

        if (task.isLocked) {
          return true
        }

        if (task.project.archivedAt) {
          return true
        }

        if (task.project.startDate && task.project.startDate > workHour.date) {
          return true
        }

        if (task.project.endDate && task.project.endDate < workHour.date) {
          return true
        }

        if (
          !(await prisma.projectMembership.findUnique({
            where: { userId_projectId: { projectId: task.project.id, userId: workHour.userId } },
          }))
        ) {
          return true
        }

        return isProjectLocked({ projectId: task.project.id, date: workHour.date })
      },
    }),
    workHour: t.prismaField({
      type: 'WorkHour',
      nullable: true,
      resolve: (query, workHour) =>
        prisma.workHour.findUnique({
          ...query,
          where: {
            date_userId_taskId: {
              date: workHour.date,
              taskId: workHour.taskId,
              userId: workHour.userId,
            },
          },
        }),
    }),
  }),
})
