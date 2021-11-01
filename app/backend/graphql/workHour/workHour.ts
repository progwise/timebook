import { objectType } from 'nexus'
import { Project } from '../project'

export const WorkHour = objectType({
    name: 'WorkHour',
    definition: (t) => {
        t.id('id', { description: 'Identifies the work hour' })
        t.nullable.string('comment')
        t.date('date', { resolve: (workHour) => workHour.date })
        t.float('hours')
        t.field('project', {
            type: Project,
            resolve: (workHour, _arguments, context) =>
                context.prisma.project.findUnique({ where: { id: workHour.projectId }, rejectOnNotFound: true }),
        })
    },
})
