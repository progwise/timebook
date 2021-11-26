import { arg, idArg, intArg, mutationField, nullable, stringArg } from 'nexus'
import { WorkHour } from '../workHour'
import { DateScalar } from '../../scalars/date'

export const createWorkHourMutationField = mutationField('createWorkHour', {
  type: WorkHour,
  description: 'Create a new WorkHour',
  args: {
    duration: intArg({ description: 'Duration of the work hour in minutes' }),
    taskId: idArg(),
    date: arg({ type: DateScalar }),
    comment: nullable(stringArg()),
  },
  authorize: (_source, _arguments, context) => !!context.session?.user.id,
  resolve: (_source, arguments_, context) => {
    if (!context.session?.user.id) {
      throw new Error('unauthenticated')
    }

    return context.prisma.workHour.create({
      data: {
        date: arguments_.date,
        duration: arguments_.duration,
        taskId: arguments_.taskId,
        userId: context.session.user.id,
        comment: arguments_.comment,
      },
    })
  },
})
