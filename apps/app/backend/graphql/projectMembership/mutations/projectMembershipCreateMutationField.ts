import { idArg, mutationField } from 'nexus'
import { isTeamAdmin } from '../../isTeamAdmin'
import { Project } from '../../project/project'

export const projectMembershipCreateMutationField = mutationField('projectMembershipCreate', {
  type: Project,
  description: 'Assign user to Project',
  args: {
    userId: idArg(),
    projectId: idArg(),
  },

  authorize: async (_source, _arguments, context) => {
    if (!context.teamSlug) return false
    const isAdmin = await isTeamAdmin(context)
    if (!isAdmin) {
      return false
    }
    const project = await context.prisma.project.findUnique({
      where: { id: _arguments.projectId },
      include: { team: true },
    })
    if (context.teamSlug !== project?.team.slug) return false
    const teamMembership = await context.prisma.teamMembership.findUnique({
      where: { userId_teamId: { userId: _arguments.userId, teamId: project.teamId } },
    })
    if (!teamMembership) {
      return false
    }
    return true
  },
  resolve: async (_source, _arguments, context) => {
    const projectMembership = await context.prisma.projectMembership.findUnique({
      where: { userId_projectId: { projectId: _arguments.projectId, userId: _arguments.userId } },
      include: { project: true },
    })
    if (projectMembership !== null) {
      return projectMembership.project
    }
    const projectMembershipNew = await context.prisma.projectMembership.create({
      data: { projectId: _arguments.projectId, userId: _arguments.userId },
      include: { project: true },
    })
    return projectMembershipNew.project
  },
})
