import { Role } from '@progwise/timebook-prisma'

import { builder } from '../builder'

export const RoleEnum = builder.enumType(Role, {
  name: 'Role',
  description: 'Roles a user can have in a team',
})
