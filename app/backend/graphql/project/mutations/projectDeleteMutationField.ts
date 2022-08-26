import { idArg, mutationField } from 'nexus'
import { Project } from '../project'
import { isTeamAdmin } from '../../isTeamAdmin'

export const projectDeleteMutationField = mutationField('projectDelete', {
  type: Project,
  description: 'Delete a project',
  args: {
    id: idArg({ description: 'id of the project' }),
  },
  authorize: async (_source, _arguments, context) => isTeamAdmin(context),
  resolve: async (_source, { id }, context) => {
    if (!context.session?.user.id) {
      throw new Error('not authenticated')
    }

    const project = await context.prisma.project.findUniqueOrThrow({
      where: { id },
      include: { team: true },
    })

    if (project.team.slug !== context.teamSlug) {
      // We can not delete a project from a different team
      throw new Error('not authenticated')
    }

    return context.prisma.project.delete({ where: { id } })
  },
})
