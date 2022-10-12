import { ForbiddenError } from 'apollo-server-core'
import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('projectMembershipCreate', (t) =>
  t.withAuth({ isTeamAdmin: true }).prismaField({
    type: 'Project',
    description: 'Assign user to Project',
    args: {
      userId: t.arg.id(),
      projectId: t.arg.id(),
    },
    authScopes: async (_source, { projectId, userId }, context) => {
      await builder.runAuthScopes(context, { isTeamAdmin: true }, () => new ForbiddenError('Not authorized'))

      const project = await prisma.project.findUniqueOrThrow({
        where: { id: projectId.toString() },
        select: { team: { select: { id: true, slug: true } } },
      })
      if (context.teamSlug !== project.team.slug) return false
      const teamMembership = await prisma.teamMembership.findUnique({
        select: { id: true },
        where: { userId_teamId: { userId: userId.toString(), teamId: project.team.id } },
      })
      if (!teamMembership) {
        return false
      }
      return true
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
