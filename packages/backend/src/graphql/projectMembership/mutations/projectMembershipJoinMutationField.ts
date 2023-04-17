import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('projectMembershipJoin', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Project',
    description: 'Add a user to a project using the invite key.',
    args: {
      inviteKey: t.arg.string(),
    },
    resolve: async (query, _source, { inviteKey }, context) => {
      const project = await prisma.project.findUnique({
        where: { inviteKey },
      })

      if (!project) {
        throw new Error('Invalid invite key')
      }

      // Add the user to the project
      const projectMembership = await prisma.projectMembership.upsert({
        select: { project: query },
        where: { userId_projectId: { userId: context.session.user.id, projectId: project.id } },
        create: {
          userId: context.session.user.id,
          projectId: project.id,
        },
        update: {},
      })

      return projectMembership.project
    },
  }),
)
