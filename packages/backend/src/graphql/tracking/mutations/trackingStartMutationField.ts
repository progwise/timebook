import { getMonth, getYear } from 'date-fns'

import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { migrateTrackingToWorkHours } from './migrateTrackingToWorkHour'

export const trackingStartMutationField = builder.mutationField('trackingStart', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Tracking',
    description:
      'Start time tracking for a task. When a tracking for the same task is already running the tracking keeps untouched. When a tracking for a different task is running, the on going tracking will be stopped and converted to work hours.',
    args: {
      taskId: t.arg.id(),
    },
    authScopes: (_source, { taskId }) => ({ isMemberByTask: taskId.toString() }),
    resolve: async (query, _source, arguments_, context) => {
      const taskId = arguments_.taskId.toString()
      const userId = context.session.user.id

      const currentTracking = await prisma.tracking.findUnique({ where: { userId } })

      const isTrackingAlreadyRunning = currentTracking?.taskId === taskId
      if (isTrackingAlreadyRunning) {
        return prisma.tracking.findUniqueOrThrow({ ...query, where: { userId } })
      }

      const now = new Date()
      const lockedMonthCount = await prisma.lockedMonth.count({
        where: {
          year: getYear(now),
          month: getMonth(now),
          project: { tasks: { some: { id: taskId } } },
        },
      })

      if (lockedMonthCount > 0) {
        throw new Error('Project is locked for this month')
      }

      const task = await prisma.task.findUniqueOrThrow({
        where: { id: taskId },
        select: { isLocked: true, project: { select: { archivedAt: true } } },
      })
      if (task.isLocked) {
        throw new Error('task is locked')
      }

      if (task.project.archivedAt) {
        throw new Error('project is archived')
      }

      if (currentTracking) {
        await migrateTrackingToWorkHours(currentTracking)
      }

      return prisma.tracking.create({ ...query, data: { userId, taskId } })
    },
  }),
)
