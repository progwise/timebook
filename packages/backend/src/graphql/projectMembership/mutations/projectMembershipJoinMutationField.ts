import { isPast } from 'date-fns'

import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('projectMembershipJoin', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'Project',
    description: 'Add a user to a project using the invitation key.',
    args: {
      invitationKey: t.arg.string(),
    },
    resolve: async (query, _source, { invitationKey }, context) => {
      const projectInvitation = await prisma.projectInvitation.findUnique({
        where: {
          invitationKey,
        },
      })

      if (!projectInvitation) {
        throw new Error('Invalid invite key')
      }

      if (isPast(projectInvitation.expireDate)) {
        throw new Error('Expired invite key')
      }

      // Add the user to the project
      const projectMembership = await prisma.projectMembership.upsert({
        select: { project: query },
        where: { userId_projectId: { userId: context.session.user.id, projectId: projectInvitation.projectId } },
        create: {
          userId: context.session.user.id,
          projectId: projectInvitation.projectId,
        },
        update: {},
      })

      return projectMembership.project
    },
  }),
)
