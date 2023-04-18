import { Button, InputField } from '@progwise/timebook-ui'

interface InviteLinkProps {
  projectId: string
  inviteKey: string
}

export const InviteLink = (props: InviteLinkProps) => {
  const inviteLink = `${process.env.NEXTAUTH_URL}/projects/join/${props.inviteKey}`

  const copyInviteLink = async () => {
    await navigator.clipboard.writeText(inviteLink)
  }

  return (
    <div className="flex items-center gap-2">
      <h4 className="whitespace-nowrap text-lg font-semibold text-gray-400">Invite link:</h4>
      <InputField variant="primary" readOnly value={inviteLink} />
      <Button variant="secondary" className="whitespace-nowrap" onClick={copyInviteLink}>
        Copy link
      </Button>
    </div>
  )
}
