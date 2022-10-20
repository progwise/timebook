import SchemaBuilder from '@pothos/core'
import PrismaPlugin from '@pothos/plugin-prisma'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth'
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects'
import { ForbiddenError } from 'apollo-server-core'

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
    isTeamMemberByTeamId: string
    isTeamMemberByTeamSlug: string
    isTeamAdminByTeamId: string
    isTeamAdminByTeamSlug: string
    isProjectMember: string
  }
  AuthContexts: {
    isLoggedIn: LoggedInContext
    hasUserId: LoggedInContext
    isTeamMemberByTeamId: LoggedInContext
    isTeamMemberByTeamSlug: LoggedInContext
    isTeamAdminByTeamId: LoggedInContext
    isTeamAdminByTeamSlug: LoggedInContext
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
    }
    Project: { id: string }
  }
}>({
  plugins: [ScopeAuthPlugin, PrismaPlugin, SimpleObjectsPlugin],
  prisma: {
    client: prisma,
    filterConnectionTotalCount: true,
  },
  defaultInputFieldRequiredness: true,
  authScopes: (context) => ({
    isLoggedIn: !!context.session,
    hasUserId: (userId: string) => context.session?.user.id === userId,
    isTeamAdminByTeamId: async (teamId) => {
      if (!context.session) {
        return false
      }

      const teamMembership = await prisma.teamMembership.findUnique({
        where: { userId_teamId: { teamId, userId: context.session.user.id } },
      })

      return teamMembership?.role === 'ADMIN'
    },
    isTeamAdminByTeamSlug: async (teamSlug) => {
      if (!context.session) {
        return false
      }

      const teamMembership = await prisma.teamMembership.findFirst({
        where: {
          userId: context.session.user.id,
          team: { slug: teamSlug },
        },
      })

      return teamMembership?.role === 'ADMIN'
    },
    isTeamMemberByTeamId: async (teamId: string) => {
      if (!context.session) {
        return false
      }

      const teamMembership = await prisma.teamMembership.findUnique({
        where: {
          userId_teamId: {
            userId: context.session.user.id,
            teamId,
          },
        },
      })

      return !!teamMembership
    },
    isTeamMemberByTeamSlug: async (teamSlug: string) => {
      if (!context.session) {
        return false
      }

      const teamMembership = await prisma.teamMembership.findFirst({
        where: {
          user: { id: context.session.user.id },
          team: { slug: teamSlug },
        },
      })

      return !!teamMembership
    },
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
})

builder.queryType()
builder.mutationType()
