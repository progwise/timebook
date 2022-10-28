import { builder } from '../builder'

export const CustomerInput = builder.inputType('CustomerInput', {
  fields: (t) => ({
    title: t.string({ description: 'Title of the customer' }),
  }),
})
