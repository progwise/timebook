import { enumType } from 'nexus'

export const Role = enumType({
  name: 'Role',
  description: 'Roles a user can have in a team',
  members: ['ADMIN', 'MEMBER'],
})
