import { addDays } from 'date-fns'

import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('projectMembershipInvitationCreate', (t) =>
  t.withAuth({ isLoggedIn: true }).prismaField({
    type: 'ProjectInvitation',
    description: 'Create a project invitation',
    authScopes: async (_source, { projectId }) => ({ isAdminByProject: projectId.toString() }),
    args: {
      projectId: t.arg.id(),
    },
    resolve: (query, _source, { projectId }, context) =>
      prisma.projectInvitation.create({
        ...query,
        data: {
          projectId: projectId.toString(),
          expireDate: addDays(new Date(), 3),
          createdByUserId: context.session.user.id,
        },
      }),
  }),
)
