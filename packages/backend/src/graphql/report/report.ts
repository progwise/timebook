import { builder } from '../builder'
import { prisma } from '../prisma'
import { ReportGroupedByDate } from './reportGroupedByDate'
import './reportGroupedByTask'
import { ReportGroupedByTask } from './reportGroupedByTask'
import { ReportGroupedByUser } from './reportGroupedByUser'

export const Report = builder.objectType('Report', {
  fields: (t) => ({
    groupedByTask: t.field({
      type: [ReportGroupedByTask],
      resolve: async ({ projectId, from, to, userId }) => {
        const groupByTaskResult = await prisma.workHour.groupBy({
          by: ['taskId'],
          where: {
            task: { projectId },
            date: { gte: from, lte: to },
            userId,
            duration: { not: 0 },
          },
          _sum: {
            duration: true,
          },
        })

        return groupByTaskResult.map(async ({ taskId, _sum: { duration } }) => ({
          task: prisma.task.findUniqueOrThrow({
            select: { id: true },
            where: { id: taskId },
          }),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          duration: duration!,
          workHours: await prisma.workHour.findMany({
            select: { id: true },
            where: {
              taskId,
              date: { gte: from, lte: to },
              userId,
              duration: { not: 0 },
            },
          }),
        }))
      },
    }),
    groupedByUser: t.field({
      type: [ReportGroupedByUser],
      resolve: async ({ projectId, from, to, userId }) => {
        const groupedByUserResult = await prisma.workHour.groupBy({
          by: ['userId'],
          where: {
            task: { projectId },
            date: { gte: from, lte: to },
            userId,
            duration: { not: 0 },
          },
          _sum: {
            duration: true,
          },
        })

        return groupedByUserResult.map(async ({ userId, _sum: { duration } }) => ({
          user: await prisma.user.findUniqueOrThrow({
            select: { id: true },
            where: { id: userId },
          }),
          workHours: await prisma.workHour.findMany({
            select: { id: true },
            where: {
              task: { projectId },
              userId,
              date: { gte: from, lte: to },
              duration: { not: 0 },
            },
          }),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          duration: duration!,
        }))
      },
    }),
    groupedByDate: t.field({
      type: [ReportGroupedByDate],
      resolve: async ({ projectId, from, to, userId }) => {
        const groupByDateResult = await prisma.workHour.groupBy({
          by: ['date'],
          where: {
            task: { projectId },
            date: { gte: from, lte: to },
            userId,
            duration: { not: 0 },
          },
          _sum: {
            duration: true,
          },
        })

        return groupByDateResult.map(async ({ date, _sum: { duration } }) => ({
          date,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          duration: duration!,
          workHours: await prisma.workHour.findMany({
            select: { id: true },
            where: {
              task: { projectId },
              date: { equals: date },
              userId,
              duration: { not: 0 },
            },
          }),
        }))
      },
    }),
    isLocked: t.boolean({
      description: 'If set to true the work hours can not be updated',
      resolve: async ({ month, year, projectId }) => {
        const report = await prisma.lockedMonth.findUnique({
          where: { projectId_year_month: { month, year, projectId } },
        })

        return !!report
      },
    }),
  }),
})
