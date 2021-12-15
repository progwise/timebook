import { objectType } from 'nexus'

export const Customer = objectType({
  name: 'Customer',
  definition: (t) => {
    t.id('id', { description: 'Identifier of the customer' })
    t.string('title', { description: 'Title of the customer' })
  },
})
