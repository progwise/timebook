import { objectType } from 'nexus'
import { Project } from '../project'
import { Task } from '../task'

export const WorkHour = objectType({
  name: 'WorkHour',
  definition: (t) => {
    t.id('id', { description: 'Identifies the work hour' })
    t.nullable.string('comment')
    t.date('date', { resolve: (workHour) => workHour.date })
    t.int('duration', {
      resolve: (workHour) => workHour.duration,
      description: 'Duration of the work hour in minutes',
    })
    t.field('project', {
      type: Project,
      resolve: async (workHour, _arguments, context) => {
        const { task } = await context.prisma.workHour.findUnique({
          where: { id: workHour.id },
          select: { task: { select: { project: true } } },
          rejectOnNotFound: true,
        })
        return task.project
      },
    })
    t.field('task', {
      type: Task,
      description: 'Task for which the working hour was booked',
      resolve: (workHour, _arguments, context) =>
        context.prisma.task.findUnique({
          where: { id: workHour.taskId },
          rejectOnNotFound: true,
        }),
    })
  },
})
