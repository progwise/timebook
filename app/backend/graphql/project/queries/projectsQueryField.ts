import { list, queryField } from 'nexus'
import { Project } from '..'

export const projectsQueryField = queryField('projects', {
    type: list(Project),
    description: 'Returns a list of all projects',
    authorize: (_source, _arguments, context) => !!context.session?.user.id,
    resolve: (_source, _arguments, context) =>
        context.prisma.project.findMany({
            where: { authorId: context.session?.user.id },
        }),
})
