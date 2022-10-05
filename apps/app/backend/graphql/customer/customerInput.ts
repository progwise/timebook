import { inputObjectType } from 'nexus'

export const CustomerInput = inputObjectType({
  name: 'CustomerInput',
  definition: (t) => {
    t.string('title', { description: 'Title of the customer' })
  },
})
