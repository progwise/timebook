import { Role } from '../../mocks/mocks.generated'

interface RoleButtonProps {
  role: Role
  onUpgrade: () => void
  onDowngrade: () => void
  loading?: boolean
}

export const RoleButton = ({ role, onUpgrade, onDowngrade, loading }: RoleButtonProps) => {
  return (
    <div>
      {role === Role.Admin ? (
        <button className="btn btn-outline btn-sm" onClick={onDowngrade} disabled={loading}>
          Demote
        </button>
      ) : (
        <button className="btn btn-outline btn-sm" onClick={onUpgrade} disabled={loading}>
          Promote
        </button>
      )}
    </div>
  )
}
