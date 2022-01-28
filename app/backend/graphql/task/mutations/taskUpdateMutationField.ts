import { idArg, mutationField } from 'nexus'
import { isTeamAdmin } from '../../isTeamAdmin'
import { Task } from '../task'
import { TaskInput } from '../taskInput'

export const taskUpdateMutationField = mutationField('taskUpdate', {
  type: Task,
  description: 'Update a task',
  args: {
    id: idArg({ description: 'id of the task' }),
    data: TaskInput,
  },
  authorize: async (_source, _arguments, context) => isTeamAdmin(context),
  resolve: (_source, { id, data: { title, projectId } }, context) => {
    return context.prisma.task.update({
      where: { id },
      data: { title, projectId },
    })
  },
})
