import { builder } from '../builder'
import { Role } from '.prisma/client'

export const RoleEnum = builder.enumType(Role, {
  name: 'Role',
  description: 'Roles a user can have in a team',
})
