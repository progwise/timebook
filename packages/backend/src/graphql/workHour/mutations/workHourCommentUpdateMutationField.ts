import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { DateScalar } from '../../scalars/date'
import { isProjectLocked } from './isProjectLocked'

builder.mutationField('workHourCommentUpdate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'WorkHour',
    description: 'Updates a comment of a work hour or creates one',
    args: {
      taskId: t.arg.id(),
      date: t.arg({ type: DateScalar }),
      comment: t.arg.string(),
    },
    authScopes: async (_source, { taskId }) => {
      return { isMemberByTask: taskId.toString() }
    },
    resolve: async (query, _source, { taskId, date, comment }, context) => {
      const previousTask = await prisma.task.findUnique({
        select: { projectId: true, isLocked: true },
        where: { id: taskId.toString() },
      })

      if (previousTask?.isLocked) {
        throw new Error('task is locked')
      }

      if (previousTask && (await isProjectLocked({ date, projectId: previousTask.projectId }))) {
        throw new Error('project is locked for the given month')
      }

      const newAssignedTask = await prisma.task.findUniqueOrThrow({
        select: { projectId: true, isLocked: true, project: { select: { archivedAt: true } } },
        where: { id: taskId.toString() },
      })

      if (newAssignedTask.isLocked) {
        throw new Error('task is locked')
      }

      if (newAssignedTask.project.archivedAt) {
        throw new Error('project is archived')
      }

      if (await isProjectLocked({ projectId: newAssignedTask.projectId, date: date })) {
        throw new Error('project is locked for the given month')
      }

      return prisma.workHour.upsert({
        ...query,
        where: {
          date_userId_taskId: { date: date, taskId: taskId.toString(), userId: context.session.user.id },
        },
        create: { taskId: taskId.toString(), userId: context.session.user.id, date, duration: 0, comment },
        update: { comment },
      })
    },
  }),
)
