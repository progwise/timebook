import { builder } from '../builder'
import { ModifyInterface } from '../interfaces/modifyInterface'
import { prisma } from '../prisma'

export const Customer = builder.prismaObject('Customer', {
  select: {},
  interfaces: [ModifyInterface],
  fields: (t) => ({
    id: t.exposeID('id', { description: 'Identifier of the customer' }),
    title: t.exposeString('title', { description: 'Title of the customer' }),
    projects: t.relation('projects', { description: 'List of all customer projects' }),
    canModify: t.withAuth({ isLoggedIn: true }).boolean({
      description: 'Can the user modify the entity',
      select: { teamId: true },
      resolve: async (customer, _arguments, context) => {
        const teamMembership = await prisma.teamMembership.findUnique({
          select: { role: true },
          where: {
            userId_teamId: {
              teamId: customer.teamId,
              userId: context.session.user.id,
            },
          },
        })
        return teamMembership?.role === 'ADMIN'
      },
    }),
  }),
})
