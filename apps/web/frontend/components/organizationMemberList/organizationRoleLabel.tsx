import { Role } from '../../generated/gql/graphql'

interface RoleLabelProps {
  role: Role
}

export const OrganizationRoleLabel = ({ role }: RoleLabelProps) => {
  if (role === Role.Admin) {
    return <span className="badge badge-primary">Organization admin</span>
  }
  return <span className="badge badge-ghost">Organization member</span>
}
