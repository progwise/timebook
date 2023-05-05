import { Button, InputField } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../generated/gql'

interface InviteLinkProps {
  project: FragmentType<typeof InviteLinkProjectFragment>
}

const InviteLinkProjectFragment = graphql(`
  fragment InviteLinkProjectFragment on Project {
    id
    inviteKey
  }
`)

export const InviteLink = (props: InviteLinkProps) => {
  const project = useFragment(InviteLinkProjectFragment, props.project)
  const inviteLink = `${process.env.NEXTAUTH_URL}/projects/join/${project.inviteKey}`

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
