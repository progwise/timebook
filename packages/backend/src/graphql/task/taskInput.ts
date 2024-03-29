import { taskInputValidations } from '@progwise/timebook-validations'

import { builder } from '../builder'

export const TaskInput = builder.inputType('TaskInput', {
  validate: { schema: taskInputValidations },
  fields: (t) => ({
    title: t.string(),
    projectId: t.id(),
    isLocked: t.boolean({ required: false, defaultValue: false }),
  }),
})
