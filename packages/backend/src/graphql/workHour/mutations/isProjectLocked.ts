import { getMonth, getYear } from 'date-fns'

import { prisma } from '../../prisma'

interface Options {
  projectId: string
  date: Date
}

export const isProjectLocked = async ({ projectId, date }: Options) => {
  const year = getYear(date)
  const month = getMonth(date)

  const report = await prisma.lockedMonth.findUnique({
    where: { projectId_year_month: { year, month, projectId } },
  })

  return !!report
}
