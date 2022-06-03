import { idArg, queryField } from 'nexus'
import { Project } from '../project'

export const projectQueryField = queryField('project', {
  type: Project,
  description: 'Returns a single project',
  args: {
    projectId: idArg({ description: 'Identifier for the project' }),
  },
  authorize: (_source, _arguments, context) => !!context.session?.user.id,
  resolve: (_source, _arguments, context) => {
    if (!context.session?.user.id) {
      throw new Error('User not authenticated')
    }

    return context.prisma.project.findFirst({
      where: {
        id: _arguments.projectId,
        OR: [
          { projectMemberships: { some: { userId: context.session.user.id } } },
          { team: { teamMemberships: { some: { role: 'ADMIN', userId: context.session.user.id } } } },
        ],
      },
      rejectOnNotFound: true,
    })
  },
})
