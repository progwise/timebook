import { booleanArg, objectType } from 'nexus'
import { Customer } from '../customer'
import { ModifyInterface } from '../interfaces/modifyInterface'
import { Task } from '../task'
import { User } from '../user'
import { WorkHour } from '../workHour'

export const Project = objectType({
  name: 'Project',
  definition: (t) => {
    t.implements(ModifyInterface)
    t.id('id', { description: 'identifies the project' })
    t.string('title', {})
    t.nullable.date('startDate', { resolve: (project) => project.startDate })
    t.nullable.date('endDate', { resolve: (project) => project.endDate })
    t.list.field('workHours', {
      type: WorkHour,
      resolve: (project, _arguments, context) =>
        context.prisma.workHour.findMany({ where: { task: { projectId: project.id } } }),
    })
    t.list.field('tasks', {
      type: Task,
      args: {
        showArchived: booleanArg({ default: false }),
      },
      resolve: (project, { showArchived }, context) =>
        context.prisma.task.findMany({
          where: {
            projectId: project.id,
            // eslint-disable-next-line unicorn/no-null
            archivedAt: showArchived ? undefined : null,
          },
        }),
    })
    t.nullable.field('customer', {
      type: Customer,
      description: 'Customer of the project',
      resolve: (project, _arguments, context) =>
        project.customerId
          ? context.prisma.customer.findUnique({
              where: { id: project.customerId },
            })
          : // eslint-disable-next-line unicorn/no-null
            null,
    })
    t.list.field('members', {
      type: User,
      description: 'List of users that are member of the project',
      resolve: (project, _arguments, context) =>
        context.prisma.user.findMany({
          where: {
            projectMemberships: {
              some: {
                projectId: project.id,
              },
            },
          },
        }),
    })
  },
})
