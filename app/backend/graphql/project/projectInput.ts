import { inputObjectType } from 'nexus'

export const ProjectInput = inputObjectType({
  name: 'ProjectInput',
  definition: (t) => {
    t.string('title')
    t.nullable.id('customerId', { description: 'Id of the customer to which the project belongs.' })
    t.nullable.date('start')
    t.nullable.date('end')
  },
})
