import { Role } from '../generated/gql/graphql'

interface RoleLabelProps {
  role: Role
  context: 'Project' | 'Organization'
}

export const RoleLabel = ({ role, context }: RoleLabelProps) => {
  const badgeClass = 'badge text-center h-full min-w-32'
  const label = role === Role.Admin ? `${context} admin` : `${context} member`
  return <span className={`${badgeClass} ${role === Role.Admin ? 'badge-primary' : 'badge-ghost'}`}>{label}</span>
}
