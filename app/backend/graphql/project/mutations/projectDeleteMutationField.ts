import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('projectDelete', (t) =>
  t.withAuth({ isTeamAdmin: true }).prismaField({
    type: 'Project',
    description: 'Delete a project',
    args: {
      id: t.arg.id({ description: 'id of the project' }),
    },
    resolve: async (query, _source, { id }, context) => {
      const project = await prisma.project.findUniqueOrThrow({
        where: { id: id.toString() },
        include: { team: true },
      })

      if (project.team.slug !== context.teamSlug) {
        // We can not delete a project from a different team
        throw new Error('not authenticated')
      }

      return prisma.project.delete({ where: { id: id.toString() } })
    },
  }),
)
