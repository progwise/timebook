import { builder } from '../builder'
import { ModifyInterface } from '../interfaces/modifyInterface'

export const Customer = builder.prismaObject('Customer', {
  select: {},
  interfaces: [ModifyInterface],
  fields: (t) => ({
    id: t.exposeID('id', { description: 'Identifier of the customer' }),
    title: t.exposeString('title', { description: 'Title of the customer' }),
    projects: t.relation('projects', { description: 'List of all customer projects' }),
  }),
})
