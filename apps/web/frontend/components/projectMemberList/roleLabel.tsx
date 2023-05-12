import { Role } from '../../generated/gql/graphql'
import { Label } from './label'

interface RoleLabelProps {
  role: Role
}

export const RoleLabel = (props: RoleLabelProps) => {
  if (props.role === Role.Admin) {
    return <Label color="blue">Admin</Label>
  }

  return <Label color="yellow">Member</Label>
}
