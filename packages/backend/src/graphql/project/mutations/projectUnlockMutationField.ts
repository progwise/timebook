import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { MonthInputType } from '../../project/monthInputType'

builder.mutationField('projectUnlock', (t) =>
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

      await prisma.lockedMonth.deleteMany({ where: { year, month, projectId } })

      return prisma.project.findUniqueOrThrow({ ...query, where: { id: projectId } })
    },
  }),
)
