import { projectInputValidations } from '@progwise/timebook-validations'

import { builder } from '../builder'

export const ProjectInput = builder.inputType('ProjectInput', {
  validate: { schema: projectInputValidations },
  fields: (t) => ({
    title: t.string(),
    start: t.field({ type: 'Date', required: false }),
    end: t.field({ type: 'Date', required: false }),
    organizationId: t.string({ required: false }),
  }),
})
