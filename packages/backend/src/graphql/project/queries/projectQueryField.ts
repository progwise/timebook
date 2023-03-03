import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('project', (t) =>
  t.prismaField({
    type: 'Project',
    description: 'Returns a single project',
    args: {
      projectId: t.arg.id({ description: 'Identifier for the project' }),
    },
    authScopes: (_source, { projectId }) => ({ isProjectMember: projectId.toString() }),
    resolve: (query, _source, { projectId }) =>
      prisma.project.findUniqueOrThrow({
        ...query,
        where: { id: projectId.toString() },
      }),
  }),
)
