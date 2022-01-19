import { ForbiddenError } from 'apollo-server-core'
import { idArg, queryField } from 'nexus'
import { Task } from '../task'

export const taskQueryField = queryField('task', {
  type: Task,
  description: 'Returns a single task',
  args: {
    taskId: idArg({ description: 'Identifier for the task' }),
  },
  authorize: (_source, _arguments, context) => !!context.session,
  resolve: (_source, { taskId }, context) => {
    if (!context.teamSlug) {
      throw new ForbiddenError('team not found')
    }

    return context.prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          team: { slug: context.teamSlug },
          projectMemberships: {
            some: {
              teamMembership: {
                userId: context.session?.user.id,
              },
            },
          },
        },
      },
      rejectOnNotFound: true,
    })
  },
})
