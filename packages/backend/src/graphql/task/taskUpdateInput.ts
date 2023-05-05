import { taskUpdateInputValidations } from '@progwise/timebook-validations'

import { builder } from '../builder'

export const TaskUpdateInput = builder.inputType('TaskUpdateInput', {
  validate: { schema: taskUpdateInputValidations },
  fields: (t) => ({
    title: t.string({ required: false }),
    projectId: t.id({ required: false }),
    isLocked: t.boolean({ required: false }),
  }),
})
