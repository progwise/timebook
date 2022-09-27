import { ForbiddenError } from 'apollo-server-core'
import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('workHourDelete', (t) =>
  t.withAuth({ isTeamMember: true }).prismaField({
    type: 'WorkHour',
    description: 'Delete a work hour entry',
    args: {
      id: t.arg.id({ description: 'id of the workHour item' }),
    },
    authScopes: async (_source, { id }, context) => {
      await builder.runAuthScopes(context, { isTeamMember: true }, () => new ForbiddenError('Not authorized'))
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
    resolve: (query, _source, { id }) => prisma.workHour.delete({ ...query, where: { id: id.toString() } }),
  }),
)
