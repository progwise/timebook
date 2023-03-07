import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { isUserTheLastAdminOfProject } from './isUserTheLastAdminOfProject'

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

      if (await isUserTheLastAdminOfProject(userId.toString(), projectId.toString())) {
        throw new Error('Membership can not be deleted because user is the last admin')
      }

      await prisma.projectMembership.delete({
        where: { userId_projectId: { projectId: projectId.toString(), userId: userId.toString() } },
      })
      return prisma.project.findUniqueOrThrow({ ...query, where: { id: projectId.toString() } })
    },
  }),
)
