import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('projectMembershipCreate', (t) =>
  t.prismaField({
    type: 'Project',
    description: 'Assign user to Project',
    args: {
      userId: t.arg.id(),
      projectId: t.arg.id(),
    },
    authScopes: (_source, { projectId }) => ({ isProjectMember: projectId.toString() }),
    resolve: async (query, _source, { userId, projectId }) => {
      const projectMembership = await prisma.projectMembership.findUnique({
        where: { userId_projectId: { projectId: projectId.toString(), userId: userId.toString() } },
        select: { project: query },
      })
      if (projectMembership !== null) {
        return projectMembership.project
      }
      const projectMembershipNew = await prisma.projectMembership.create({
        data: { projectId: projectId.toString(), userId: userId.toString() },
        select: { project: query },
      })
      return projectMembershipNew.project
    },
  }),
)
