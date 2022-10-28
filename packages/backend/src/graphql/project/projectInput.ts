import { builder } from '../builder'

export const ProjectInput = builder.inputType('ProjectInput', {
  fields: (t) => ({
    title: t.string(),
    customerId: t.id({
      required: false,
      description: 'Id of the customer to which the project belongs.',
      // eslint-disable-next-line unicorn/no-null
      defaultValue: null,
    }),
    start: t.field({ type: 'Date', required: false }),
    end: t.field({ type: 'Date', required: false }),
  }),
})
