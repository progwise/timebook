import { list, objectType } from 'nexus'
import { Project } from '../project'
import { WorkHour } from '../workHour'

export const Task = objectType({
  name: 'Task',
  definition: (t) => {
    t.id('id', { description: 'Identifies the task' })
    t.string('title', { description: 'The user can identify the task in the UI' })
    t.field('project', {
      type: Project,
      resolve: async (task, _arguments, context) =>
        context.prisma.project.findUnique({
          where: { id: task.projectId },
          rejectOnNotFound: true,
        }),
    })
    t.field('workhours', {
      type: list(WorkHour),
      resolve: async (task, _arguments, context) =>
        context.prisma.workHour.findMany({
          where: { taskId: task.id },
        }),
    })
  },
})
