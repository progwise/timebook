import { arg, idArg, queryField } from 'nexus'
import { Report } from '../report'

export const reportQueryField = queryField('report', {
  type: Report,
  description: 'Returns a monthly project report',
  args: {
    projectId: idArg({ description: 'Project identifier' }),
    from: arg({ type: 'Date' }),
    to: arg({ type: 'Date' }),
  },
  resolve: (_source, { projectId, from, to }, context) => ({
    groupedByTask: async () => {
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
        task: () =>
          context.prisma.task.findUnique({
            where: { id: taskId },
            rejectOnNotFound: true,
          }),
        duration: duration!,
        workHours: () =>
          context.prisma.workHour.findMany({
            where: {
              taskId,
              date: { gte: from, lte: to },
            },
          }),
      }))
    },
  }),
})
