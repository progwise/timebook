import { Theme as PrismaTheme } from '@prisma/client'
import { builder } from '../builder'

export const Theme = builder.enumType(PrismaTheme, { name: 'Theme' })
