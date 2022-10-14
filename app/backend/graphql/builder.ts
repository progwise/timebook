import { ForbiddenError } from 'apollo-server-core'
import SchemaBuilder from '@pothos/core'
import PrismaTypes from '@pothos/plugin-prisma/generated'
import PrismaPlugin from '@pothos/plugin-prisma'
import ScopeAuthPlugin from '@pothos/plugin-scope-auth'
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects'
import { Context, LoggedInContext, LoggedInInSlugContext } from './context'
import { prisma } from './prisma'

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  Context: Context
  DefaultInputFieldRequiredness: true
  AuthScopes: {
    isLoggedIn: boolean
    hasUserId: string
    isTeamMember: boolean
    isTeamAdmin: boolean
    isTeamMemberByTeamSlug: string
    isTeamAdminByTeamId: string
    isTeamAdminByTeamSlug: string
    isProjectMember: string
  }
  AuthContexts: {
    isLoggedIn: LoggedInContext
    hasUserId: LoggedInContext
    isTeamMember: LoggedInInSlugContext
    isTeamAdmin: LoggedInInSlugContext
    isTeamMemberByTeamSlug: LoggedInInSlugContext
    isTeamAdminByTeamId: LoggedInInSlugContext
    isTeamAdminByTeamSlug: LoggedInInSlugContext
    isProjectMember: LoggedInInSlugContext
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
    isTeamMember: async () => {
      if (!context.session || !context.teamSlug) {
        return false
      }

      const teamMembership = await prisma.teamMembership.findFirst({
        where: {
          userId: context.session.user.id,
          team: { slug: context.teamSlug },
        },
      })

      return !!teamMembership
    },
    isTeamAdmin: async () => {
      if (!context.session || !context.teamSlug) {
        return false
      }

      const teamMembership = await prisma.teamMembership.findFirst({
        where: {
          userId: context.session.user.id,
          team: { slug: context.teamSlug },
        },
      })

      return teamMembership?.role === 'ADMIN'
    },
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
      if (!context.session || !context.teamSlug) {
        return false
      }

      const projectMemberShip = await prisma.projectMembership.findFirst({
        where: {
          userId: context.session.user.id,
          project: {
            id: projectId,
            team: {
              slug: context.teamSlug,
            },
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
