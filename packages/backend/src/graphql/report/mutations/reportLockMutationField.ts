import { endOfMonth, startOfMonth } from 'date-fns'

import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { Report } from '../report'

builder.mutationField('reportLock', (t) =>
  t.field({
    type: Report,
    args: {
      year: t.arg.int(),
      month: t.arg.int(),
      userId: t.arg.id(),
      projectId: t.arg.id(),
    },
    authScopes: (_source, { projectId }) => ({ isAdminByProject: projectId.toString() }),
    resolve: async (_source, arguments_) => {
      const { year, month } = arguments_
      const userId = arguments_.userId.toString()
      const projectId = arguments_.projectId.toString()

      const from = startOfMonth(new Date(year, month))
      const to = endOfMonth(new Date(year, month))

      await prisma.report.upsert({
        create: { year, month, projectId, userId },
        where: { projectId_userId_year_month: { year, month, projectId, userId } },
        update: {},
      })

      return { month, year, userId, projectId, from, to }
    },
  }),
)
