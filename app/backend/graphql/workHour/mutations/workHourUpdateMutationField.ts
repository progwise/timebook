import { idArg, mutationField } from 'nexus'
import { WorkHour } from '../workHour'
import { WorkHourInput } from '../workHourInput'

export const workHourUpdateMutationField = mutationField('workHourUpdate', {
  type: WorkHour,
  description: 'Updates a work hour entry',
  args: {
    id: idArg({ description: 'id of the work hour item' }),
    data: WorkHourInput,
  },
  authorize: (_source, _arguments, context) => !!context.session?.user.id,
  resolve: (_source, { id, data }, context) => {
    return context.prisma.workHour.update({
      where: { id },
      data: {
        comment: data.comment,
        duration: data.duration,
        taskId: data.taskId,
      },
    })
  },
})
