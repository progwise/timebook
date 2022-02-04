import { idArg, mutationField } from 'nexus'
import { isTeamAdmin } from '../../isTeamAdmin'
import { Task } from '../task'

export const taskArchiveMutationField = mutationField('taskArchive', {
  type: Task,
  description: 'Archive a task',
  args: {
    taskId: idArg({ description: 'id of the task' }),
  },
  authorize: (_source, _arguments, context) => isTeamAdmin(context),
  resolve: (_source, { taskId }, context) => {
    return context.prisma.task.update({
      where: { id: taskId },
      data: {
        archivedAt: new Date(),
      },
    })
  },
})
