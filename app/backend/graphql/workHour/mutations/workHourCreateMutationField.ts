import { mutationField } from 'nexus'
import { WorkHour } from '../workHour'
import { WorkHourInput } from '../workHourInput'

export const workHourCreateMutationField = mutationField('workHourCreate', {
  type: WorkHour,
  description: 'Create a new WorkHour',
  args: {
    data: WorkHourInput,
  },
  authorize: async (_source, arguments_, context) => {
    if (!context.session || !context.teamSlug) {
      return false
    }

    const task = await context.prisma.task.findFirst({
      where: {
        id: arguments_.data.taskId,
        project: { team: { slug: context.teamSlug } },
      },
    })

    if (!task) {
      return false
    }

    const projectMember = await context.prisma.projectMembership.findUnique({
      where: { userId_projectId: { userId: context.session.user.id, projectId: task.projectId } },
    })

    return !!projectMember
  },

  resolve: (_source, arguments_, context) => {
    if (!context.session) {
      throw new Error('unauthenticated')
    }

    return context.prisma.workHour.create({
      data: {
        date: arguments_.data.date,
        duration: arguments_.data.duration,
        taskId: arguments_.data.taskId,
        userId: context.session.user.id,
      },
    })
  },
})
