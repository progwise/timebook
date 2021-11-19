import { intArg, queryField } from 'nexus'
import { Project } from '..'

export const projectQueryField = queryField('project', {
  type: Project,
  description: 'Returns a single project',
  args: {
    projectId: intArg({ description: 'Identifier for the project' }),
  },
  authorize: (_source, _arguments, context) => !!context.session?.user.id,
  resolve: (_source, _arguments, context) => {
    if (!context.session?.user.id) {
      throw new Error('User not authenticated')
    }
    return context.prisma.project.findFirst({
      where: {
        id: _arguments.projectId,
        projectMemberships: { some: { userId: context.session?.user.id } },
      },
      rejectOnNotFound: true,
    })
  },
})
