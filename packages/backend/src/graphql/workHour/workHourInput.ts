import { workHourInputValidations } from '@progwise/timebook-validations'

import { builder } from '../builder'
import { DateScalar } from '../scalars'

export const WorkHourInput = builder.inputType('WorkHourInput', {
  validate: { schema: workHourInputValidations },
  fields: (t) => ({
    date: t.field({ type: DateScalar }),
    duration: t.int({ description: 'Duration of the work hour in minutes' }),
    taskId: t.id(),
  }),
})
