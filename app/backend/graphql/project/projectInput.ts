import { inputObjectType } from 'nexus'

export const ProjectInput = inputObjectType({
  name: 'ProjectInput',
  definition: (t) => {
    t.string('title')
    t.nullable.date('start')
    t.nullable.date('end')
  },
})
