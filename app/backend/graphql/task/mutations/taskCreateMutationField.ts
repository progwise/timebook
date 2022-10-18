import { builder } from '../../builder'
import { TaskInput } from '../taskInput'
import { prisma } from '../../prisma'

builder.mutationField('taskCreate', (t) =>
  t.prismaField({
    type: 'Task',
    description: 'Create a new Task',
    args: {
      data: t.arg({ type: TaskInput }),
    },
    authScopes: async (_source, { data: { projectId } }) => {
      const project = await prisma.project.findUniqueOrThrow({
        select: { teamId: true },
        where: { id: projectId.toString() },
      })

      return { isTeamAdminByTeamId: project.teamId }
    },
    resolve: (query, _source, { data: { title, projectId } }) =>
      prisma.task.create({
        ...query,
        data: {
          title,
          projectId: projectId.toString(),
        },
      }),
  }),
)
