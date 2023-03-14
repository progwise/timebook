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
    isMemberByProject: string
    isMemberByProjects: string[]
    isMemberByTask: string
    isAdminByProject: string
    isAdminByProjects: string[]
    isAdminByTask: string
  }
  AuthContexts: {
    isLoggedIn: LoggedInContext
    hasUserId: LoggedInContext
    isMemberByProject: LoggedInContext
    isMemberByProjects: LoggedInContext
    isMemberByTask: LoggedInContext
    isAdminByProject: LoggedInContext
    isAdminByProjects: LoggedInContext
    isAdminByTask: LoggedInContext
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
      year: number
      month: number
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
    isMemberByProject: async (projectId) => {
      if (!context.session) {
        return false
      }

      const projectMembership = await prisma.projectMembership.findUnique({
        where: {
          userId_projectId: {
            userId: context.session.user.id,
            projectId,
          },
        },
      })

      return !!projectMembership
    },
    isMemberByProjects: async (projectIds) => {
      if (!context.session) {
        return false
      }

      const uniqueProjectIds = [...new Set(projectIds)]
      const projectMembershipsCount = await prisma.projectMembership.count({
        where: { userId: context.session.user.id, projectId: { in: uniqueProjectIds } },
      })

      return projectMembershipsCount === uniqueProjectIds.length
    },
    isMemberByTask: async (taskId) => {
      if (!context.session) {
        return false
      }

      const projectMembership = await prisma.projectMembership.findFirst({
        select: { role: true },
        where: {
          userId: context.session.user.id,
          project: { tasks: { some: { id: taskId } } },
        },
      })

      return !!projectMembership
    },
    isAdminByProject: async (projectId) => {
      if (!context.session) {
        return false
      }

      const projectMembership = await prisma.projectMembership.findUnique({
        select: { role: true },
        where: {
          userId_projectId: {
            userId: context.session.user.id,
            projectId,
          },
        },
      })

      return projectMembership?.role === 'ADMIN'
    },
    isAdminByProjects: async (projectIds) => {
      if (!context.session) {
        return false
      }
      const uniqueProjectIds = [...new Set(projectIds)]
      const projectMembershipsCount = await prisma.projectMembership.count({
        where: {
          userId: context.session.user.id,
          projectId: { in: uniqueProjectIds },
          role: 'ADMIN',
        },
      })

      return projectMembershipsCount === uniqueProjectIds.length
    },
    isAdminByTask: async (taskId) => {
      if (!context.session) {
        return false
      }

      const projectMembership = await prisma.projectMembership.findFirst({
        select: { role: true },
        where: {
          userId: context.session.user.id,
          project: {
            tasks: { some: { id: taskId } },
          },
        },
      })

      return projectMembership?.role === 'ADMIN'
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
