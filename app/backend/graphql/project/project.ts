import { objectType } from 'nexus'
import { WorkHour } from '../workHour'

export const Project = objectType({
    name: 'Project',
    definition: (t) => {
        t.id('id', { description: 'identifies the project' })
        t.string('title', {})
        // eslint-disable-next-line unicorn/no-null
        t.nullable.string('startDate', { resolve: (project) => project.startDate?.toISOString() ?? null })
        // eslint-disable-next-line unicorn/no-null
        t.nullable.string('endDate', { resolve: (project) => project.endDate?.toISOString() ?? null })
        t.list.field('workHours', {
            type: WorkHour,
            resolve: (project, _arguments, context) =>
                context.prisma.workHour.findMany({ where: { projectId: project.id } }),
        })
    },
})
