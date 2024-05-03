import { organizationInputValidations } from '@progwise/timebook-validations'

import { builder } from '../builder'

export const OrganizationInput = builder.inputType('OrganizationInput', {
  validate: { schema: organizationInputValidations },
  fields: (t) => ({
    title: t.string(),
    address: t.string({ required: false }),
  }),
})
