import { Role } from '../../generated/gql/graphql'
import { Label } from './label'

interface RoleLabelProps {
  role: Role
  onUpgrade: () => void
  onDowngrade: () => void
  loading?: boolean
}

export const RoleLabel = ({ role, onUpgrade, onDowngrade, loading }: RoleLabelProps) => (
  <div className="flex flex-row space-x-5">
    <Label color={role === Role.Admin ? 'blue' : 'yellow'}>{role === Role.Admin ? 'Admin' : 'Member'}</Label>
    <Label color={role === Role.Admin ? 'yellow' : 'blue'}>
      <div className="flex flex-row space-x-2">
        {role === Role.Admin ? (
          <button onClick={onDowngrade} disabled={loading} className="hover:hover:scale-95 disabled:opacity-50">
            Downgrade
          </button>
        ) : (
          <button onClick={onUpgrade} disabled={loading} className="hover:hover:scale-95 disabled:opacity-50">
            Upgrade
          </button>
        )}
      </div>
    </Label>
  </div>
)
