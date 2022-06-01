import { useRouter } from 'next/router'
import { TeamFragment, useTeamArchiveMutation } from '../generated/graphql'
import { Button } from './button/button'
import { Modal } from './modal'

export interface TeamArchiveModalProps {
  open: boolean
  onClose: () => void
  team: TeamFragment
}

export const TeamArchiveModal = (props: TeamArchiveModalProps): JSX.Element => {
  const { open, onClose, team } = props
  const [{ fetching }, teamArchive] = useTeamArchiveMutation()
  const router = useRouter()

  const handleArchiveTeam = async () => {
    try {
      await teamArchive({ teamId: team.id })
      await router.push('/teams')
    } catch {}
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Are you sure you want to archive ${team.title}?`}
      actions={
        <>
          <Button variant="tertiary" onClick={onClose} disabled={fetching}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleArchiveTeam} disabled={fetching}>
            Archive
          </Button>
        </>
      }
    />
  )
}
