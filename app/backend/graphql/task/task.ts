import { list, objectType } from 'nexus'
import { Project } from '../project'
import { WorkHour } from '../workHour'
import { ModifyInterface } from '../interfaces/modifyInterface'

export const Task = objectType({
  name: 'Task',
  definition: (t) => {
    t.implements(ModifyInterface)
    t.id('id', { description: 'Identifies the task' })
    t.string('title', { description: 'The user can identify the task in the UI' })
    t.nullable.float('hourlyRate', {
      description: 'For calculating the money spent',
      // eslint-disable-next-line unicorn/no-null
      resolve: (task) => task.hourlyRate?.toNumber() ?? null,
    })
    t.boolean('archived', { resolve: (task) => !!task.archivedAt })
    t.boolean('hasWorkHours', {
      resolve: async (task, _arguments, context) => {
        const count = await context.prisma.workHour.count({ where: { taskId: task.id } })
        return count > 0
      },
    })
    t.field('project', {
      type: Project,
      resolve: async (task, _arguments, context) =>
        context.prisma.project.findUniqueOrThrow({
          where: { id: task.projectId },
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
