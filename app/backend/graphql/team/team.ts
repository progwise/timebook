import { objectType } from 'nexus'
import { Theme } from './theme'

export const Team = objectType({
  name: 'Team',
  definition: (t) => {
    t.id('id', { description: 'Identifier of the team' })
    t.string('title', { description: 'Title of the team' })
    t.string('slug', { description: 'Slug that is used in the team URL' })
    t.field('theme', {
      type: Theme,
      description: 'Color theme of the team',
    })
    t.string('inviteKey')
  },
})
