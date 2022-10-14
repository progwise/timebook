import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.queryField('project', (t) =>
  t.withAuth({ isTeamMember: true }).prismaField({
    type: 'Project',
    description: 'Returns a single project',
    args: {
      projectId: t.arg.id({ description: 'Identifier for the project' }),
    },
    resolve: (query, _source, { projectId }, context) =>
      prisma.project.findFirstOrThrow({
        ...query,
        orderBy: [{ title: 'asc' }],
        where: {
          id: projectId.toString(),
          team: { slug: context.teamSlug },
          OR: [
            { projectMemberships: { some: { userId: context.session.user.id } } },
            { team: { teamMemberships: { some: { userId: context.session.user.id, role: 'ADMIN' } } } },
          ],
        },
      }),
  }),
)
