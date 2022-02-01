import { inputObjectType } from 'nexus'

export const TaskInput = inputObjectType({
  name: 'TaskInput',
  definition: (t) => {
    t.string('title')
    t.id('projectId')
  },
})
