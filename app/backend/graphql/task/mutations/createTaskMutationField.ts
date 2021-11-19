import { arg, intArg, mutationField, nullable, stringArg } from 'nexus'
import { DateScalar } from '../../scalars/date'
import { Task } from '../task'

export const createTaskMutationField = mutationField('createTaskMutation', {
  type: Task,
  description: 'Create a new Task',
  args: {
    title: stringArg({ description: 'Title for the task' }),
    projectId: intArg(),
    startDate: nullable(arg({ type: DateScalar })),
    endDate: nullable(arg({ type: DateScalar })),
  },
  authorize: (_source, _arguments, context) => !!context.session?.user.id,
  resolve: (_source, arguments_, context) => {
    if (!context.session?.user.id) {
      throw new Error('unauthenticated')
    }

    return context.prisma.task.create({
      data: {
        title: arguments_.title,
        projectId: arguments_.projectId,
        startDate: arguments_.startDate,
        endDate: arguments_.endDate,
      },
    })
  },
})
