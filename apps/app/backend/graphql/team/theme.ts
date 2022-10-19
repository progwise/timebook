import { builder } from '../builder'
import { Theme as PrismaTheme } from '.prisma/client'

export const Theme = builder.enumType(PrismaTheme, { name: 'Theme' })
