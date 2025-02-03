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
