import { idArg, mutationField } from 'nexus'
import { isAdminByProjectId } from '../../isAdminByProjectId'
import { isAdminByTaskId } from '../../isAdminByTaskId'
import { Task } from '../task'
import { TaskInput } from '../taskInput'

export const taskUpdateMutationField = mutationField('taskUpdate', {
  type: Task,
  description: 'Update a task',
  args: {
    id: idArg({ description: 'id of the task' }),
    data: TaskInput,
  },
  authorize: async (_source, arguments_, context) =>
    (await isAdminByTaskId(arguments_.id, context)) && (await isAdminByProjectId(arguments_.data.projectId, context)),
  resolve: (_source, { id, data: { title, projectId } }, context) => {
    return context.prisma.task.update({
      where: { id },
      data: { title, projectId },
    })
  },
})
