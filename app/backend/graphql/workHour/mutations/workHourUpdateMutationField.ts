import { ForbiddenError } from 'apollo-server-core'
import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { WorkHourInput } from '../workHourInput'

builder.mutationField('workHourUpdate', (t) =>
  t.withAuth({ isTeamMember: true }).prismaField({
    type: 'WorkHour',
    description: 'Updates a work hour entry',
    args: {
      id: t.arg.id({ description: 'id of the work hour item' }),
      data: t.arg({ type: WorkHourInput }),
    },
    authScopes: async (_source, { id }, context) => {
      await builder.runAuthScopes(context, { isTeamMember: true }, () => new ForbiddenError('Not authorized'))

      // verifying a workHour <- task <- project <- team availability
      const workHour = await prisma.workHour.findFirst({
        select: { id: true, userId: true },
        where: {
          id: id.toString(),
          task: { project: { team: { slug: context.teamSlug } } },
        },
      })

      if (!workHour) {
        return false
      }

      return {
        isTeamAdmin: true,
        hasUserId: workHour.userId,
      }
    },
    resolve: (query, _source, { id, data: { date, duration, taskId } }) =>
      prisma.workHour.update({
        ...query,
        where: { id: id.toString() },
        data: {
          date: date,
          duration: duration,
          taskId: taskId.toString(),
        },
      }),
  }),
)
