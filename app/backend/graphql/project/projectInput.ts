import { inputObjectType } from 'nexus'

export const ProjectInput = inputObjectType({
  name: 'ProjectInput',
  definition: (t) => {
    t.string('title')
    // eslint-disable-next-line unicorn/no-null
    t.nullable.id('customerId', { description: 'Id of the customer to which the project belongs.', default: null })
    t.nullable.date('start')
    t.nullable.date('end')
  },
})
