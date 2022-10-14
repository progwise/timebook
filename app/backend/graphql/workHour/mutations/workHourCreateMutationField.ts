import { ForbiddenError } from 'apollo-server-core'
import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { WorkHourInput } from '../workHourInput'

builder.mutationField('workHourCreate', (t) =>
  t.withAuth({ isTeamMember: true }).prismaField({
    type: 'WorkHour',
    description: 'Create a new WorkHour',
    args: {
      data: t.arg({ type: WorkHourInput }),
    },
    authScopes: async (_source, { data }, context) => {
      await builder.runAuthScopes(context, { isTeamMember: true }, () => new ForbiddenError('Not authorized'))

      const task = await prisma.task.findFirst({
        where: {
          id: data.taskId.toString(),
          project: { team: { slug: context.teamSlug } },
        },
      })

      if (!task) {
        return false
      }

      const projectMember = await prisma.projectMembership.findUnique({
        where: { userId_projectId: { userId: context.session.user.id, projectId: task.projectId } },
      })

      return !!projectMember
    },
    resolve: (query, _source, { data: { date, duration, taskId } }, context) => {
      const workHourKey = {
        date,
        taskId: taskId.toString(),
        userId: context.session.user.id,
      }

      return prisma.workHour.upsert({
        ...query,
        where: { date_userId_taskId: workHourKey },
        create: { ...workHourKey, duration },
        update: { duration: { increment: duration } },
      })
    },
  }),
)
