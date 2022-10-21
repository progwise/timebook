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
    authScopes: async (_source, { projectId, userId }) => {
      const project = await prisma.project.findUnique({
        where: { id: projectId.toString() },
        select: { teamId: true },
      })

      if (!project) {
        return false
      }

      const teamMembership = await prisma.teamMembership.findUnique({
        select: { id: true },
        where: { userId_teamId: { userId: userId.toString(), teamId: project.teamId } },
      })
      return teamMembership ? { isTeamAdminByTeamId: project.teamId } : false
    },
    resolve: async (query, _source, { userId, projectId }) => {
      const projectMembership = await prisma.projectMembership.findUnique({
        where: { userId_projectId: { projectId: projectId.toString(), userId: userId.toString() } },
      })
      if (!projectMembership) {
        throw new Error('project membership not found')
      }
      await prisma.projectMembership.delete({
        where: { userId_projectId: { projectId: projectId.toString(), userId: userId.toString() } },
      })
      return prisma.project.findUniqueOrThrow({ ...query, where: { id: projectId.toString() } })
    },
  }),
)
