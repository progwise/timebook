import { Role } from '../../generated/gql/graphql'

interface RoleLabelProps {
  role: Role
}

export const RoleLabel = (props: RoleLabelProps) => {
  if (props.role === Role.Admin) {
    return <span className="badge badge-primary">Admin</span>
  }
  return <span className="badge badge-ghost">Member</span>
}
