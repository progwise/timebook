import { enumType } from 'nexus'

export const Theme = enumType({
  name: 'Theme',
  members: ['GRAY', 'RED', 'YELLOW', 'GREEN', 'BLUE', 'INDIGO', 'PURPLE', 'PINK'],
})
