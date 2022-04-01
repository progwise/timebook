import { arg, idArg, queryField } from 'nexus'
import { Report } from '../report'

export interface ReportSource {
  projectId: string
  from: Date
  to: Date
}

export const reportQueryField = queryField('report', {
  type: Report,
  description: 'Returns a monthly project report',
  args: {
    projectId: idArg({ description: 'Project identifier' }),
    from: arg({ type: 'Date' }),
    to: arg({ type: 'Date' }),
  },
  resolve: (_source, arguments_) => arguments_,
  authorize: async (_source, arguments_, context) => {
    if (!context.teamSlug) {
      throw new Error('No team slug found')
    }
    if (!context.session) {
      throw new Error('No session found')
    }
    const project = await context.prisma.project.findFirst({
      where: {
        id: arguments_.projectId,
        team: { slug: context.teamSlug },
      },
    })
    if (!project) {
      throw new Error('No project found')
    }
    const projectMember = await context.prisma.projectMembership.findFirst({
      where: {
        projectId: arguments_.projectId,
        teamMembership: {
          userId: context.session.user.id,
        },
      },
    })
    const teamMember = await context.prisma.teamMembership.findFirst({
      where: {
        team: { slug: context.teamSlug },
        userId: context.session.user.id,
      },
    })
    const isTeamAdmin: boolean = teamMember?.role === 'ADMIN'

    if (!projectMember && !isTeamAdmin) {
      throw new Error('Not authorized')
    }

    return true
  },
})
