import { builder } from '../builder'

export const TaskInput = builder.inputType('TaskInput', {
  fields: (t) => ({
    title: t.string(),
    projectId: t.id(),
  }),
})
