import SchemaBuilder from '@pothos/core'
import ErrorsPlugin from '@pothos/plugin-errors'
import PrismaPlugin from '@pothos/plugin-prisma'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth'
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects'
import ValidationPlugin from '@pothos/plugin-validation'
import { ForbiddenError, UserInputError } from 'apollo-server-core'

import { Context, LoggedInContext } from './context'
import { prisma } from './prisma'
import { getWhereUserIsMember } from './project/queries/getWhereUserIsMember'
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
    isMemberByOrganization: string
    isAdminByProject: string
    isAdminByProjects: string[]
    isAdminByTask: string
    isAdminByOrganization: string
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
    isAdminByOrganization: LoggedInContext
  }
  Scalars: {
    Date: {
      Input: Date
      Output: Date
    }
    DateTime: {
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
    WorkHourOfDay: {
      date: Date
      taskId: string
      userId: string
    }
  }
}>({
  plugins: [ScopeAuthPlugin, PrismaPlugin, SimpleObjectsPlugin, ValidationPlugin, ErrorsPlugin],
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

      const project = await prisma.project.findFirst({
        select: { id: true },
        where: {
          id: projectId,
          ...getWhereUserIsMember(context.session.user.id),
        },
      })

      return !!project
    },

    isMemberByProjects: async (projectIds) => {
      if (!context.session) {
        return false
      }

      const uniqueProjectIds = [...new Set(projectIds)]
      const projectsCount = await prisma.project.count({
        where: {
          id: { in: uniqueProjectIds },
          ...getWhereUserIsMember(context.session.user.id),
        },
      })

      return projectsCount === uniqueProjectIds.length
    },
    isMemberByTask: async (taskId) => {
      if (!context.session) {
        return false
      }

      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          project: { ...getWhereUserIsMember(context.session.user.id) },
        },
      })

      return !!task
    },
    isMemberByOrganization: async (organizationId) => {
      if (!context.session) {
        return false
      }
      const organizationMembership = await prisma.organizationMembership.findUnique({
        where: {
          userId_organizationId: {
            userId: context.session.user.id,
            organizationId,
          },
        },
      })

      return !!organizationMembership
    },
    isAdminByOrganization: async (organizationId) => {
      if (!context.session) {
        return false
      }
      const organizationMembership = await prisma.organizationMembership.findUnique({
        where: {
          userId_organizationId: {
            userId: context.session.user.id,
            organizationId,
          },
          organizationRole: 'ADMIN',
        },
      })

      return !!organizationMembership
    },
    isAdminByProject: async (projectId) => {
      if (!context.session) {
        return false
      }

      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          ...getWhereUserIsMember(context.session.user.id, true),
        },
      })

      return !!project
    },
    isAdminByProjects: async (projectIds) => {
      if (!context.session) {
        return false
      }
      const uniqueProjectIds = [...new Set(projectIds)]
      const projectMembershipsCount = await prisma.project.count({
        where: getWhereUserIsMember(context.session.user.id, true),
      })

      return projectMembershipsCount === uniqueProjectIds.length
    },
    isAdminByTask: async (taskId) => {
      if (!context.session) {
        return false
      }

      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          project: { ...getWhereUserIsMember(context.session.user.id, true) },
        },
      })

      return !!task
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
