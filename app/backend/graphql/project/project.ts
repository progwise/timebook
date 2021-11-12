import { objectType } from 'nexus'
import { WorkHour } from '../workHour'

export const Project = objectType({
  name: 'Project',
  definition: (t) => {
    t.id('id', { description: 'identifies the project' })
    t.string('title', {})
    t.nullable.date('startDate', { resolve: (project) => project.startDate })
    t.nullable.date('endDate', { resolve: (project) => project.endDate })
    t.list.field('workHours', {
      type: WorkHour,
      resolve: (project, _arguments, context) =>
        context.prisma.workHour.findMany({ where: { task: { projectId: project.id } } }),
    })
  },
})
