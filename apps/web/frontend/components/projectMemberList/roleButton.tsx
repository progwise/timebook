import { Button } from '@progwise/timebook-ui'

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
        <Button variant="secondary" onClick={onDowngrade} disabled={loading}>
          Demote
        </Button>
      ) : (
        <Button variant="secondary" onClick={onUpgrade} disabled={loading}>
          Promote
        </Button>
      )}
    </div>
  )
}
