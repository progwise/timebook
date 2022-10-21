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
