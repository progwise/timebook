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

      const projectMembership = await prisma.projectMembership.findUnique({
        where: {
          userId_projectId: {
            userId: context.session.user.id,
            projectId,
          },
        },
      })

      if (projectMembership) {
        return true
      }

      const project = await prisma.project.findUnique({ where: { id: projectId }, select: { organizationId: true } })

      if (!project?.organizationId) {
        return false
      }

      const organizationMembership = await prisma.organizationMembership.findUnique({
        where: {
          userId_organizationId: {
            userId: context.session.user.id,
            organizationId: project.organizationId,
          },
        },
      })

      return !!organizationMembership
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

      if (projectMembership) {
        return true
      }

      const task = await prisma.task.findUnique({
        where: { id: taskId },
        select: { project: { select: { organizationId: true } } },
      })

      if (!task?.project.organizationId) {
        return false
      }

      const organizationMembership = await prisma.organizationMembership.findUnique({
        where: {
          userId_organizationId: {
            userId: context.session.user.id,
            organizationId: task.project.organizationId,
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
        },
      })

      return !!organizationMembership
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

      if (projectMembership?.role === 'ADMIN') {
        return true
      }

      const project = await prisma.project.findUnique({ where: { id: projectId }, select: { organizationId: true } })

      if (!project?.organizationId) {
        return false
      }

      const organizationMembership = await prisma.organizationMembership.findUnique({
        where: {
          userId_organizationId: {
            userId: context.session.user.id,
            organizationId: project.organizationId,
          },
        },
      })

      return !!organizationMembership
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

      const projectMembership = await prisma.projectMembership.findFirst({
        select: { role: true },
        where: {
          userId: context.session.user.id,
          project: {
            tasks: { some: { id: taskId } },
          },
        },
      })

      if (projectMembership?.role === 'ADMIN') {
        return true
      }

      const task = await prisma.project.findUnique({ where: { id: taskId }, select: { organizationId: true } })

      if (!task?.organizationId) {
        return false
      }

      const organizationMembership = await prisma.organizationMembership.findUnique({
        where: {
          userId_organizationId: {
            userId: context.session.user.id,
            organizationId: task.organizationId,
          },
        },
      })

      return !!organizationMembership
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
