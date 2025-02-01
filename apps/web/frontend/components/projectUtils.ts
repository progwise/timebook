import { useSession } from 'next-auth/react'

type ProjectMember = {
  id: string
}

type Project = {
  members: ProjectMember[]
  canModify: boolean
}

export const isSessionUserAdminOfProject = (project: Project, sessionUserId: string) => {
  return project.members.some((member: ProjectMember) => member.id === sessionUserId && project.canModify)
}

export const getSessionUserId = () => {
  const sessionUser = useSession()
  return sessionUser.data?.user.id
}
