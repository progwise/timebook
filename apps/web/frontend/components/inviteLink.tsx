import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../generated/gql'
import { Role } from '../generated/gql/graphql'

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

  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/projects/join/${project.inviteKey}`

  const handleCopyInviteLink = async () => {
    await navigator.clipboard.writeText(inviteLink)
  }
  const handleRegenerateClick = async () => {
    await regenerateInviteKey({ projectId: project.id })
  }

  return (
    <div className="form-control">
      <div className="label">
        <label className="label-text" htmlFor="invite-link">
          Invite link
        </label>
      </div>
      <div className="flex items-center gap-2">
        <input className="input input-bordered w-full" readOnly value={inviteLink} id="invite-link" />
        <button className="btn btn-primary btn-sm" onClick={handleCopyInviteLink}>
          Copy link
        </button>
        {Role.Admin &&
        <button
          className="btn btn-primary btn-sm"
          onClick={handleRegenerateClick}
          disabled={fetchingRegenerateInviteKey}
        >
          Regenerate link
        </button>
        }
      </div>
    </div>
  )
}
