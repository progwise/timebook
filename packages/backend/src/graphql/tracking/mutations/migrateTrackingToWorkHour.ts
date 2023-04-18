import {
  addDays,
  differenceInMinutes,
  eachDayOfInterval,
  eachMonthOfInterval,
  getMonth,
  getYear,
  max,
  min,
  subMinutes,
} from 'date-fns'

import { Tracking, Prisma } from '@progwise/timebook-prisma'

import { prisma } from '../../prisma'

interface WorkHourQuery {
  include?: Prisma.WorkHourSelect
  select?: Prisma.WorkHourSelect
}

export const migrateTrackingToWorkHours = async (tracking: Tracking, workHourQuery: WorkHourQuery = {}) => {
  const now = new Date()
  const interval = { start: tracking.start, end: now }

  const lockedMonthCount = await Promise.all(
    eachMonthOfInterval(interval).map((date) =>
      prisma.lockedMonth.count({
        where: {
          project: { tasks: { some: { id: tracking.taskId } } },
          year: getYear(date),
          month: getMonth(date),
        },
      }),
    ),
  )

  if (lockedMonthCount.some((count) => count !== 0)) {
    throw new Error('Project is locked for the current month')
  }

  const projectMembershipCount = await prisma.projectMembership.count({
    where: {
      project: { tasks: { some: { id: tracking.taskId } } },
      userId: tracking.userId,
    },
  })

  if (projectMembershipCount === 0) {
    throw new Error('User is no longer a project member')
  }

  const task = await prisma.task.findUniqueOrThrow({ select: { isLocked: true }, where: { id: tracking.taskId } })
  if (task.isLocked) {
    throw new Error('task is locked')
  }

  const [, ...workHours] = await prisma.$transaction([
    prisma.tracking.delete({ where: { userId: tracking.userId } }),
    ...eachDayOfInterval(interval).map((startOfTheDay) => {
      const startOfTheWorkHour = max([tracking.start, startOfTheDay])
      const endOfTheWorkHour = min([now, addDays(startOfTheDay, 1)])
      const duration = differenceInMinutes(endOfTheWorkHour, startOfTheWorkHour)

      // startOfTheDay is 0' a clock in the configured timezone.
      // In timezones with a negative offset (e.g. Berlin) this day is in UTC the day before
      // To save the work hour on the correct day we subtract the offset.
      const date = subMinutes(startOfTheDay, startOfTheDay.getTimezoneOffset())

      return prisma.workHour.upsert({
        ...workHourQuery,
        where: {
          date_userId_taskId: {
            date,
            taskId: tracking.taskId,
            userId: tracking.userId,
          },
        },
        create: { date, taskId: tracking.taskId, duration, userId: tracking.userId },
        update: { duration: { increment: duration } },
      })
    }),
  ])

  return workHours
}
