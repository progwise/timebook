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

  resolve: async (_source, arguments_, context) => {
    if (!context.session) {
      throw new Error('unauthenticated')
    }

    const workHourKey = {
      date: arguments_.data.date,
      taskId: arguments_.data.taskId,
      userId: context.session.user.id,
    }

    const oldRecord = await context.prisma.workHour.findUnique({ where: { date_userId_taskId: workHourKey } })

    if (oldRecord) {
      return context.prisma.workHour.update({
        where: { date_userId_taskId: workHourKey },
        data: { duration: oldRecord.duration + arguments_.data.duration },
      })
    }

    return context.prisma.workHour.create({ data: { ...workHourKey, duration: arguments_.data.duration } })
  },
})
