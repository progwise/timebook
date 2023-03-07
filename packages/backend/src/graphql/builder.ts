import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth'
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects'
import ValidationPlugin from '@pothos/plugin-validation'
import { ForbiddenError, UserInputError } from 'apollo-server-core'

import { Context, LoggedInContext } from './context'
import { prisma } from './prisma'
import PrismaTypes from '.pothos/plugin-prisma/generated'

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  Context: Context
  DefaultInputFieldRequiredness: true
  AuthScopes: {
    isLoggedIn: boolean
    hasUserId: string
    isProjectMember: string
  }
  AuthContexts: {
    isLoggedIn: LoggedInContext
    hasUserId: LoggedInContext
    isProjectMember: LoggedInContext
  }
  Scalars: {
    Date: {
      Input: Date
      Output: Date
    }
  }
  Objects: {
    Report: {
      projectId: string
      from: Date
      to: Date
      userId?: string
    }
    Project: { id: string }
  }
}>({
  plugins: [ScopeAuthPlugin, PrismaPlugin, SimpleObjectsPlugin, ValidationPlugin],
  prisma: {
    client: prisma,
    filterConnectionTotalCount: true,
  },
  defaultInputFieldRequiredness: true,
  authScopes: (context) => ({
    isLoggedIn: !!context.session,
    hasUserId: (userId: string) => context.session?.user.id === userId,
    isProjectMember: async (projectId) => {
      if (!context.session) {
        return false
      }

      const projectMemberShip = await prisma.projectMembership.findUnique({
        where: {
          userId_projectId: {
            userId: context.session.user.id,
            projectId,
          },
        },
      })

      return !!projectMemberShip
    },
  }),
  scopeAuthOptions: {
    unauthorizedError: () => new ForbiddenError(`Not authorized`),
  },
  validationOptions: {
    validationError: (zodError) => {
      const errorMessage = zodError.errors[0].message
      return new UserInputError(errorMessage)
    },
  },
})

builder.queryType()
builder.mutationType()
