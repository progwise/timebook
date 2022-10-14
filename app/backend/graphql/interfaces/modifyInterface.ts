import { builder } from '../builder'
import { prisma } from '../prisma'

class ModifyInterfaceHelper {}

export const ModifyInterface = builder.interfaceType(ModifyInterfaceHelper, {
  name: 'ModifyInterface',
  description: 'Adds the information whether the user can edit the entity',
  fields: (t) => ({
    canModify: t.withAuth({ isTeamMember: true }).boolean({
      description: 'Can the user modify the entity',
      resolve: async (_source, _arguments, context) => {
        const membership = await prisma.teamMembership.findFirstOrThrow({
          where: {
            userId: context.session.user.id,
            team: { slug: context.teamSlug },
          },
        })

        return membership.role === 'ADMIN'
      },
    }),
  }),
})
