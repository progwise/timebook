import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { MonthInputType } from '../monthInputType'

builder.mutationField('projectLock', (t) =>
  t.prismaField({
    type: 'Project',
    args: {
      date: t.arg({ type: MonthInputType }),
      projectId: t.arg.id(),
    },
    authScopes: (_source, { projectId }) => ({ isAdminByProject: projectId.toString() }),
    resolve: async (query, _source, arguments_) => {
      const { year, month } = arguments_.date
      const projectId = arguments_.projectId.toString()

      const lockedMonth = await prisma.lockedMonth.upsert({
        select: { project: query },
        create: { year, month, projectId },
        where: { projectId_year_month: { year, month, projectId } },
        update: {},
      })

      return lockedMonth.project
    },
  }),
)
