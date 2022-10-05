import { idArg, mutationField } from 'nexus'
import { isTeamAdmin } from '../../isTeamAdmin'
import { WorkHour } from '../workHour'
import { WorkHourInput } from '../workHourInput'

export const workHourUpdateMutationField = mutationField('workHourUpdate', {
  type: WorkHour,
  description: 'Updates a work hour entry',
  args: {
    id: idArg({ description: 'id of the work hour item' }),
    data: WorkHourInput,
  },
  authorize: async (_source, arguments_, context) => {
    //Verifying if there is a session or a team
    if (!context.session || !context.teamSlug) {
      return false
    }
    //verifying a task <- project <- team availability
    const task = await context.prisma.task.findFirst({
      where: {
        id: arguments_.id,
        project: { team: { slug: context.teamSlug } },
      },
    })

    if (!task) {
      return false
    }

    if (await isTeamAdmin(context)) {
      return true
    }

    // Verifying project membership of the user
    const projectMember = await context.prisma.projectMembership.findUnique({
      where: { userId_projectId: { userId: context.session.user.id, projectId: task.projectId } },
    })

    return !!projectMember
  },

  resolve: (_source, { id, data }, context) => {
    return context.prisma.workHour.update({
      where: { id },
      data,
    })
  },
})
