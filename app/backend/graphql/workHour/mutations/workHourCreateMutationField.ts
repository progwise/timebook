import { mutationField } from 'nexus'
import { WorkHour } from '../workHour'

import { WorkHourInput } from '../workHourInput'

export const workHourCreateMutationField = mutationField('workHourCreate', {
  type: WorkHour,
  description: 'Create a new WorkHour',
  args: {
    data: WorkHourInput,
  },
  authorize: (_source, _arguments, context) => !!context.session?.user.id,
  resolve: (_source, arguments_, context) => {
    if (!context.session?.user.id) {
      throw new Error('unauthenticated')
    }

    return context.prisma.workHour.create({
      data: {
        date: arguments_.data.date,
        duration: arguments_.data.duration,
        taskId: arguments_.data.taskId,
        userId: context.session.user.id,
        comment: arguments_.data.comment,
      },
    })
  },
})
