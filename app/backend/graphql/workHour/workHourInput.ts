import { inputObjectType } from 'nexus'

export const WorkHourInput = inputObjectType({
  name: 'WorkHourInput',
  definition: (t) => {
    t.date('date')
    t.int('duration', {
      description: 'Duration of the work hour in minutes',
    })
    t.id('taskId')
  },
})
