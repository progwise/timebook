import { useSession } from 'next-auth/react'

type ProjectMember = {
  id: string
  name?: string
  image?: string
}

type Project = {
  members: ProjectMember[]
  canModify: boolean
}

export const isSessionUserAdminOfProject = (project: Project, sessionUserId: string) => {
  return project.members.some((member: ProjectMember) => member.id === sessionUserId && project.canModify)
}

export const getSessionUser = () => {
  const sessionUser = useSession()
  return {
    id: sessionUser.data?.user.id,
    name: sessionUser.data?.user.name,
    image: sessionUser.data?.user.image,
    status: sessionUser.status,
  }
}
