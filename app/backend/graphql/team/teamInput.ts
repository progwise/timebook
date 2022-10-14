import { builder } from '../builder'
import { Theme } from './theme'

export const TeamInput = builder.inputType('TeamInput', {
  fields: (t) => ({
    title: t.string({ description: 'Title of the team' }),
    slug: t.string({ description: 'Slug that is used in the team URL' }),
    theme: t.field({ type: Theme, required: false, description: 'Color theme of the team' }),
  }),
})
