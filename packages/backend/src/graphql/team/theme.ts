import { Theme as PrismaTheme } from '@progwise/timebook-prisma'

import { builder } from '../builder'

export const Theme = builder.enumType(PrismaTheme, { name: 'Theme' })
