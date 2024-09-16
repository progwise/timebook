import { Role } from '../../generated/gql/graphql'

interface RoleLabelProps {
  role: Role
}

export const ProjectRoleLabel = (props: RoleLabelProps) => {
  if (props.role === Role.Admin) {
    return <span className="badge badge-primary">Project admin</span>
  }
  return <span className="badge badge-ghost">Project member</span>
}
