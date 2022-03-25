import { objectType } from 'nexus'
import { ReportGroupedByDate } from './reportGroupedByDate'
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
            task: { projectId },
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
          duration: duration!,
          workHours: context.prisma.workHour.findMany({
            where: {
              taskId,
              date: { gte: from, lte: to },
            },
          }),
        }))
      },
    })

    t.list.field('groupedByDate', {
      type: ReportGroupedByDate,
      resolve: async ({ projectId, from, to }, _arguments, context) => {
        const groupByDateResult = await context.prisma.workHour.groupBy({
          by: ['date'],
          where: {
            task: { projectId },
            date: { gte: from, lte: to },
          },
          _sum: {
            duration: true,
          },
        })

        return groupByDateResult.map(({ date, _sum: { duration } }) => ({
          date,
          duration: duration!,
          workHours: context.prisma.workHour.findMany({
            where: {
              date: { equals: date },
            },
          }),
        }))
      },
    })
  },
})
