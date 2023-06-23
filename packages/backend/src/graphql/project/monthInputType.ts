import { builder } from '../builder'

export const MonthInputType = builder.inputType('MonthInput', {
  fields: (t) => ({
    year: t.int(),
    month: t.int(),
  }),
})
