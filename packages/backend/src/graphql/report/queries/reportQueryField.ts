import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { DateScalar } from '../../scalars'

builder.queryField('report', (t) =>
  t.field({
    type: 'Report',
    description: 'Returns a monthly project report',
    authScopes: async (_source, { projectId }) => {
      const project = await prisma.project.findUniqueOrThrow({
        select: { teamId: true },
        where: { id: projectId.toString() },
      })

      return { isProjectMember: projectId.toString(), isTeamAdminByTeamId: project.teamId }
    },
    args: {
      projectId: t.arg.id({ description: 'Project identifier' }),
      from: t.arg({ type: DateScalar }),
      to: t.arg({ type: DateScalar }),
    },
    resolve: (_source, { projectId, from, to }) => ({ projectId: projectId.toString(), from, to }),
  }),
)
