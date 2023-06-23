import { useMutation } from 'urql'

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

const projectRegenerateInviteKeyMutation = graphql(`
  mutation projectRegenerateInviteKey($projectId: ID!) {
    projectRegenerateInviteKey(projectId: $projectId) {
      title
      inviteKey
    }
  }
`)

export const InviteLink = (props: InviteLinkProps) => {
  const project = useFragment(InviteLinkProjectFragment, props.project)
  const [{ fetching: fetchingRegenerateInviteKey }, regenerateInviteKey] = useMutation(
    projectRegenerateInviteKeyMutation,
  )
  const inviteLink = `${process.env.NEXTAUTH_URL}/projects/join/${project.inviteKey}`

  const handleCopyInviteLink = async () => {
    await navigator.clipboard.writeText(inviteLink)
  }
  const handleRegenerateClick = async () => {
    await regenerateInviteKey({ projectId: project.id })
  }

  return (
    <div className="flex items-center gap-2">
      <label className="flex grow gap-2">
        <h4 className="whitespace-nowrap text-lg font-semibold text-gray-400">Invite link:</h4>
        <InputField variant="primary" readOnly value={inviteLink} className="w-full" />
      </label>
      <Button variant="secondary" className="whitespace-nowrap" onClick={handleCopyInviteLink}>
        Copy link
      </Button>
      <Button
        variant="secondary"
        className="whitespace-nowrap"
        onClick={handleRegenerateClick}
        disabled={fetchingRegenerateInviteKey}
      >
        Regenerate link
      </Button>
    </div>
  )
}
