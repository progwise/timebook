import { mutationField } from 'nexus'
import { isTeamAdmin } from '../../isTeamAdmin'
import { Task } from '../task'
import { TaskInput } from '../taskInput'

export const taskCreateMutationField = mutationField('taskCreate', {
  type: Task,
  description: 'Create a new Task',
  args: {
    data: TaskInput,
  },
  authorize: async (_source, _arguments, context) => isTeamAdmin(context),
  resolve: (_source, { data: { title, projectId } }, context) => {
    if (!context.session?.user.id) {
      throw new Error('unauthenticated')
    }

    return context.prisma.task.create({
      data: {
        title: title,
        projectId: projectId,
      },
    })
  },
})
