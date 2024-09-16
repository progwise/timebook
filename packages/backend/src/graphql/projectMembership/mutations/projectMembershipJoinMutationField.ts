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
        include: {
          project: {
            select: {
              organizationId: true,
            },
          },
        },
      })

      if (!projectInvitation) {
        throw new Error('Invalid invitation key.')
      }

      if (isPast(projectInvitation.expireDate)) {
        throw new Error('Expired invitation key.')
      }

      // Add the user to the project
      const projectMembership = await prisma.projectMembership.upsert({
        select: { project: query },
        where: { userId_projectId: { userId: context.session.user.id, projectId: projectInvitation.projectId } },
        create: {
          userId: context.session.user.id,
          projectId: projectInvitation.projectId,
          invitationId: projectInvitation.id,
        },
        update: {},
      })

      if (projectInvitation.project.organizationId) {
        await prisma.organizationMembership.upsert({
          where: {
            userId_organizationId: {
              userId: context.session.user.id,
              organizationId: projectInvitation.project.organizationId,
            },
          },
          create: {
            userId: context.session.user.id,
            organizationId: projectInvitation.project.organizationId,
            role: 'MEMBER',
          },
          update: {},
        })
      }

      return projectMembership.project
    },
  }),
)
