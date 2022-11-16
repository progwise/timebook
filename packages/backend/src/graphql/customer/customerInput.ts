import { customerInputValidation } from '@progwise/timebook-validations'

import { builder } from '../builder'

export const CustomerInput = builder.inputType('CustomerInput', {
  validate: { schema: customerInputValidation },
  fields: (t) => ({
    title: t.string({ description: 'Title of the customer' }),
  }),
})
