import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('projectMembershipDelete', (t) =>
  t.prismaField({
    type: 'Project',
    description: 'Unassign user to Project',
    args: {
      userId: t.arg.id(),
      projectId: t.arg.id(),
    },
    authScopes: (_source, { projectId }) => ({ isProjectAdmin: projectId.toString() }),
    resolve: async (query, _source, { userId, projectId }) => {
      const projectMembership = await prisma.projectMembership.findUnique({
        where: { userId_projectId: { projectId: projectId.toString(), userId: userId.toString() } },
      })
      if (!projectMembership) {
        throw new Error('project membership not found')
      }

      const numberOfAdminsOnTheProject = await prisma.projectMembership.count({
        where: {
          projectId: projectId.toString(),
          role: 'ADMIN',
        },
      })
      if (projectMembership.role === 'ADMIN' && numberOfAdminsOnTheProject === 1) {
        throw new Error('Membership can not be deleted because user is the last admin')
      }

      await prisma.projectMembership.delete({
        where: { userId_projectId: { projectId: projectId.toString(), userId: userId.toString() } },
      })
      return prisma.project.findUniqueOrThrow({ ...query, where: { id: projectId.toString() } })
    },
  }),
)
