import { isSameDay } from 'date-fns'

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
        const groupedByTaskResult = await prisma.workHour.groupBy({
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

        const allTaskIds = groupedByTaskResult.map(({ taskId }) => taskId)
        const allWorkHours = await prisma.workHour.findMany({
          select: { id: true, taskId: true },
          where: {
            taskId: { in: allTaskIds },
            date: { gte: from, lte: to },
            userId,
            duration: { not: 0 },
          },
        })

        return Promise.all(
          groupedByTaskResult.map(async ({ taskId, _sum: { duration } }) => ({
            task: await prisma.task.findUniqueOrThrow({
              select: { id: true },
              where: { id: taskId },
            }),
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            duration: duration!,
            workHours: allWorkHours.filter((workHour) => workHour.taskId === taskId),
          })),
        )
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

        const allUserIds = groupedByUserResult.map(({ userId }) => userId)
        const allWorkHours = await prisma.workHour.findMany({
          select: { id: true, userId: true },
          where: {
            task: { projectId },
            userId: { in: allUserIds },
            date: { gte: from, lte: to },
            duration: { not: 0 },
          },
        })

        return groupedByUserResult.map(async ({ userId, _sum: { duration } }) => ({
          user: await prisma.user.findUniqueOrThrow({
            select: { id: true },
            where: { id: userId },
          }),
          workHours: allWorkHours.filter((workHour) => workHour.userId === userId),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          duration: duration!,
        }))
      },
    }),
    groupedByDate: t.field({
      type: [ReportGroupedByDate],
      resolve: async ({ projectId, from, to, userId }) => {
        const groupedByDateResult = await prisma.workHour.groupBy({
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

        const allDates = groupedByDateResult.map(({ date }) => date)
        const allWorkHours = await prisma.workHour.findMany({
          select: { id: true, date: true },
          where: {
            task: { projectId },
            date: { in: allDates },
            userId,
            duration: { not: 0 },
          },
        })

        return groupedByDateResult.map(async ({ date, _sum: { duration } }) => ({
          date,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          duration: duration!,
          workHours: allWorkHours.filter((workHour) => isSameDay(workHour.date, date)),
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
