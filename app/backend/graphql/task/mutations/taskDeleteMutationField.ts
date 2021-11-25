import { idArg, mutationField } from 'nexus'
import { Task } from '../task'
import { isAdminByTaskId } from '../../isAdminByTaskId'

export const taskDeleteMutationField = mutationField('taskDelete', {
  type: Task,
  description: 'Delete a task',
  args: {
    id: idArg({ description: 'id of the task' }),
  },
  authorize: async (_source, _arguments, context) => isAdminByTaskId(_arguments.id, context),
  resolve: (_source, { id }, context) => {
    if (!context.session?.user.id) {
      throw new Error('not authenticated')
    }

    return context.prisma.task.delete({ where: { id: id } })
  },
})
