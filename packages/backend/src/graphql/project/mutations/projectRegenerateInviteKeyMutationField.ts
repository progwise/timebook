import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('projectRegenerateInviteKey', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Project',
    authScopes: async (_source, { projectId }) => ({ isAdminByProject: projectId.toString() }),
    args: {
      projectId: t.arg.id(),
    },
    resolve: (query, _source, { projectId }) =>
      prisma.project.update({
        ...query,
        where: {
          id: projectId.toString(),
        },
        data: {
          inviteKey: crypto.randomUUID(),
        },
      }),
    description: 'Regenerate the invite key of a project. The old key will be outdated.',
  }),
)
