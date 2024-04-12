import { addDays } from 'date-fns'

import { builder } from '../../builder'
import { prisma } from '../../prisma'

builder.mutationField('projectMembershipInvitation', (t) =>
  t.prismaField({
    type: 'ProjectInvitation',
    description: 'Create an invitation to join a project',
    args: {
      projectId: t.arg.id(),
    },
    resolve: async (query, _source, { projectId }) => {
      return await prisma.projectInvitation.create({
        ...query,
        data: {
          expireDate: addDays(new Date(), 3),
          projectId: projectId.toString(),
        },
      })
    },
  }),
)
