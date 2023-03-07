import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('projectDelete', (t) =>
  t.prismaField({
    type: 'Project',
    description: 'Delete a project',
    authScopes: async (_source, { id }) => ({ isProjectAdmin: id.toString() }),
    args: {
      id: t.arg.id({ description: 'id of the project' }),
    },
    resolve: async (query, _source, { id }) => prisma.project.delete({ ...query, where: { id: id.toString() } }),
  }),
)
