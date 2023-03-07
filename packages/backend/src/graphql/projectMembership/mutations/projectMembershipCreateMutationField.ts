import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { RoleEnum } from '../../user/role'

builder.mutationField('projectMembershipCreate', (t) =>
  t.prismaField({
    type: 'Project',
    description: 'Assign user to a project. This mutation can also be used for updating the role of a project member',
    args: {
      userId: t.arg.id(),
      projectId: t.arg.id(),
      role: t.arg({ type: RoleEnum, defaultValue: 'MEMBER' }),
    },
    authScopes: (_source, { projectId }) => ({ isProjectAdmin: projectId.toString() }),
    resolve: async (query, _source, { userId, projectId, role }) => {
      const projectMembership = await prisma.projectMembership.upsert({
        select: { project: query },
        where: { userId_projectId: { userId: userId.toString(), projectId: projectId.toString() } },
        create: {
          userId: userId.toString(),
          projectId: projectId.toString(),
          role: role,
        },
        update: { role },
      })

      return projectMembership.project
    },
  }),
)
