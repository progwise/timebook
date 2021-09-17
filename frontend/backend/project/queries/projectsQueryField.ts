import { list, queryField } from 'nexus'
import { Project } from '..'

export const projectsQueryField = queryField('projects', {
    type: list(Project),
    description: 'Returns a list of all projects',
    resolve: (_source, _arguments, context) => context.prisma.project.findMany(),
})
