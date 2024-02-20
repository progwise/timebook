import { v4 as uuidv4 } from 'uuid'

import { accessTokenInputValidations } from '@progwise/timebook-validations'

import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { hashAccessToken } from '../hashAccessToken'

builder.mutationField('accessTokenCreate', (t) =>
  t.withAuth({ isLoggedIn: true }).string({
    description: 'Create an access token for the signed in user',
    args: {
      name: t.arg.string(),
    },
    validate: { schema: accessTokenInputValidations },
    resolve: async (_source, { name }, context) => {
      const accessTokenString = uuidv4()
      const tokenHash = hashAccessToken(accessTokenString)
      await prisma.accessToken.create({ data: { name, tokenHash, userId: context.session.user.id } })
      return accessTokenString
    },
  }),
)
