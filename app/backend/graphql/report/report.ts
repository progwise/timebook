import { objectType } from 'nexus'
import { ReportGroupedByDate } from './reportGroupedByDate'
import { ReportGroupedByUser } from './reportGroupedByUser'
import { ReportGroupedByTask } from './reportGroupedByTask'

export const Report = objectType({
  name: 'Report',
  definition: (t) => {
    t.list.field('groupedByTask', {
      type: ReportGroupedByTask,
      resolve: async ({ projectId, from, to }, _arguments, context) => {
        const groupByTaskResult = await context.prisma.workHour.groupBy({
          by: ['taskId'],
          where: {
            task: {
              projectId,
              project: { team: { slug: context.teamSlug } },
            },
            date: { gte: from, lte: to },
          },
          _sum: {
            duration: true,
          },
        })

        return groupByTaskResult.map(({ taskId, _sum: { duration } }) => ({
          task: context.prisma.task.findUnique({
            where: { id: taskId },
            rejectOnNotFound: true,
          }),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          duration: duration!,
          workHours: context.prisma.workHour.findMany({
            where: {
              task: {
                id: taskId,
                project: { team: { slug: context.teamSlug } },
              },
              date: { gte: from, lte: to },
            },
          }),
        }))
      },
    })

    t.list.field('groupedByUser', {
      type: ReportGroupedByUser,
      resolve: async ({ projectId, from, to }, _arguments, context) => {
        const groupedByUserResult = await context.prisma.workHour.groupBy({
          by: ['userId'],
          where: {
            task: {
              projectId,
              project: { team: { slug: context.teamSlug } },
            },
            date: { gte: from, lte: to },
          },
          _sum: {
            duration: true,
          },
        })

        return groupedByUserResult.map(({ userId, _sum: { duration } }) => ({
          user: context.prisma.user.findUnique({
            where: { id: userId },
            rejectOnNotFound: true,
          }),
          workHours: context.prisma.workHour.findMany({
            where: {
              task: {
                projectId,
                project: { team: { slug: context.teamSlug } },
              },
              userId,
              date: { gte: from, lte: to },
            },
          }),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          duration: duration!,
        }))
      },
    })

    t.list.field('groupedByDate', {
      type: ReportGroupedByDate,
      resolve: async ({ projectId, from, to }, _arguments, context) => {
        const groupByDateResult = await context.prisma.workHour.groupBy({
          by: ['date'],
          where: {
            task: {
              projectId,
              project: { team: { slug: context.teamSlug } },
            },
            date: { gte: from, lte: to },
          },
          _sum: {
            duration: true,
          },
        })

        return groupByDateResult.map(({ date, _sum: { duration } }) => ({
          date,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          duration: duration!,
          workHours: context.prisma.workHour.findMany({
            where: {
              task: {
                projectId,
                project: { team: { slug: context.teamSlug } },
              },
              date: { equals: date },
            },
          }),
        }))
      },
    })
  },
})
