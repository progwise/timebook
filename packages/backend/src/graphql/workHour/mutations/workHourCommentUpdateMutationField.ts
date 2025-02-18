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
      userId: t.arg.id({ required: false }),
    },
    authScopes: async (_source, { taskId }) => {
      return { isMemberByTask: taskId.toString() }
    },
    resolve: async (query, _source, { taskId, date, comment, userId }, context) => {
      const task = await prisma.task.findUniqueOrThrow({
        select: { projectId: true, isLocked: true, project: { select: { archivedAt: true } } },
        where: { id: taskId.toString() },
      })

      if (task.isLocked) {
        throw new Error('task is locked')
      }

      if (await isProjectLocked({ date, projectId: task.projectId })) {
        throw new Error('project is locked for the given month')
      }

      if (task.project.archivedAt) {
        throw new Error('project is archived')
      }

      const targetUserId = userId || context.session.user.id

      return prisma.workHour.upsert({
        ...query,
        where: {
          date_userId_taskId: { date: date, taskId: taskId.toString(), userId: targetUserId.toString() },
        },
        create: { taskId: taskId.toString(), userId: targetUserId.toString(), date, duration: 0, comment },
        update: { comment },
      })
    },
  }),
)
