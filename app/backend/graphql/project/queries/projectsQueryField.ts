import { list, queryField } from 'nexus'
import { Project } from '../project'

export const projectsQueryField = queryField('projects', {
  type: list(Project),
  description: 'Returns a list of all projects',
  authorize: (_source, _arguments, context) => !!context.session?.user.id,
  resolve: (_source, _arguments, context) =>
    context.prisma.project.findMany({
      where: {
        team: { slug: context.teamSlug },
        projectMemberships: {
          some: {
            teamMembership: {
              userId: context.session?.user.id,
            },
          },
        },
      },
    }),
})
