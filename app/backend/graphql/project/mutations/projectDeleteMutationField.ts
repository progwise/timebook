import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('projectDelete', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Project',
    description: 'Delete a project',
    authScopes: async (_source, { id }) => {
      const project = await prisma.project.findUniqueOrThrow({ select: { teamId: true }, where: { id: id.toString() } })
      return { isTeamAdminByTeamId: project.teamId }
    },
    args: {
      id: t.arg.id({ description: 'id of the project' }),
    },
    resolve: async (query, _source, { id }) => prisma.project.delete({ ...query, where: { id: id.toString() } }),
  }),
)
