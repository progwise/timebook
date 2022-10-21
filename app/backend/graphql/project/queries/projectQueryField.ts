import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('project', (t) =>
  t.prismaField({
    type: 'Project',
    description: 'Returns a single project',
    args: {
      projectId: t.arg.id({ description: 'Identifier for the project' }),
    },
    authScopes: async (_source, { projectId }) => {
      const project = await prisma.project.findUniqueOrThrow({
        select: { id: true, teamId: true },
        where: { id: projectId.toString() },
      })

      return { isTeamAdminByTeamId: project.teamId, isProjectMember: project.id }
    },
    resolve: (query, _source, { projectId }) =>
      prisma.project.findUniqueOrThrow({
        ...query,
        where: { id: projectId.toString() },
      }),
  }),
)
