import { inputObjectType } from 'nexus'
import { Theme } from './theme'

export const TeamInput = inputObjectType({
  name: 'TeamInput',
  definition: (t) => {
    t.string('title', { description: 'Title of the team' })
    t.string('slug', { description: 'Slug that is used in the team URL' })
    t.nullable.field('theme', {
      type: Theme,
      description: 'Color theme of the team',
    })
  },
})
