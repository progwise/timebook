import { idArg, mutationField } from 'nexus'
import { isTeamAdmin } from '../../isTeamAdmin'
import { WorkHour } from '../workHour'

export const workHourDeleteMutationField = mutationField('workHourDelete', {
  type: WorkHour,
  description: 'Delete a work hour entry',
  args: {
    id: idArg({ description: 'id of the workHour item' }),
  },
  authorize: async (_source, { id }, context) => {
    if (!context.session || !context.teamSlug) {
      return false
    }

    const workHour = await context.prisma.workHour.findFirst({
      where: {
        id,
        task: { project: { team: { slug: context.teamSlug } } },
      },
    })

    if (!workHour) {
      return false
    }

    if (await isTeamAdmin(context)) {
      return true
    }

    return context.session.user.id === workHour.userId
  },

  resolve: async (_source, { id }, context) => {
    return await context.prisma.workHour.delete({ where: { id } })
  },
})
