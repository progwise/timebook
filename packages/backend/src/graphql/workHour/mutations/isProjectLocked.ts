import { getMonth, getYear } from 'date-fns'

import { prisma } from '../../prisma'

interface Options {
  projectId: string
  userId: string
  date: Date
}

export const isProjectLocked = async ({ projectId, userId, date }: Options) => {
  const year = getYear(date)
  const month = getMonth(date)

  const report = await prisma.report.findUnique({
    where: { projectId_userId_year_month: { year, month, projectId, userId } },
  })

  return !!report
}
