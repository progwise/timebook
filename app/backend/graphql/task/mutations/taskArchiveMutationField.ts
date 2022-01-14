import { idArg, mutationField } from 'nexus'
import { isAdminByTaskId } from '../../isAdminByTaskId'
import { Task } from '../task'

export const taskArchiveMutationField = mutationField('taskArchive', {
  type: Task,
  description: 'Archive a task',
  args: {
    taskId: idArg({ description: 'id of the task' }),
  },
  authorize: (_source, { taskId }, context) => isAdminByTaskId(taskId, context),
  resolve: (_source, { taskId }, context) => {
    return context.prisma.task.update({
      where: { id: taskId },
      data: {
        archivedAt: new Date(),
      },
    })
  },
})
