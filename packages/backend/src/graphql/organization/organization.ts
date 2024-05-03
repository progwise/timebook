import { getMonth, getYear } from 'date-fns'

import { builder } from '../builder'
import { ModifyInterface } from '../interfaces/modifyInterface'
import { prisma } from '../prisma'

export const Organization = builder.prismaObject('Organization', {
  select: {},
  interfaces: [ModifyInterface],
  fields: (t) => ({
    id: t.exposeID('id', { description: 'identifies the project' }),
    title: t.exposeString('title'),
    address: t.exposeString('address', {
      nullable: true,
    }),
    isArchived: t.boolean({
      select: { archivedAt: true },
      resolve: (organization) => !!organization.archivedAt,
    }),
  }),
})
