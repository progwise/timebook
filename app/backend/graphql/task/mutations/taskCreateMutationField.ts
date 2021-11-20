import { mutationField } from 'nexus'
import { Task } from '../task'
import { TaskInput } from '../taskInput'

export const taskCreateMutationField = mutationField('taskCreate', {
  type: Task,
  description: 'Create a new Task',
  args: {
    data: TaskInput,
  },
  authorize: (_source, _arguments, context) => !!context.session?.user.id,
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
