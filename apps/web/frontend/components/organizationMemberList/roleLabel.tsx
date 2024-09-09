import { Role } from '../../generated/gql/graphql'

interface RoleLabelProps {
  role: Role
  isOrganizationMember: boolean
}

export const RoleLabel = ({ role, isOrganizationMember }: RoleLabelProps) => {
  if (role === Role.Admin && isOrganizationMember) {
    return <span className="badge badge-primary">Organization admin</span>
  }
  if (isOrganizationMember) {
    return <span className="badge badge-ghost">Organization member</span>
  }
  return <span className="badge badge-ghost">Project member</span>
}
