import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('task', (t) =>
  t.withAuth({ isTeamMember: true }).prismaField({
    type: 'Task',
    description: 'Returns a single task',
    args: {
      taskId: t.arg.id({ description: 'Identifier for the task' }),
    },
    resolve: (query, _source, { taskId }, context) =>
      prisma.task.findFirstOrThrow({
        ...query,
        where: {
          id: taskId.toString(),
          project: {
            team: { slug: context.teamSlug },
            OR: [
              { projectMemberships: { some: { userId: context.session.user.id } } },
              {
                team: {
                  teamMemberships: {
                    some: {
                      userId: context.session.user.id,
                      role: 'ADMIN',
                    },
                  },
                },
              },
            ],
          },
        },
      }),
  }),
)
