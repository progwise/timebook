import { FragmentType, graphql, useFragment } from '../generated/gql'
import { useRef } from 'react'

interface InviteLinkProps {
  project: FragmentType<typeof InviteLinkProjectFragment>
}

const InviteLinkProjectFragment = graphql(`
  fragment InviteLinkProjectFragment on Project {
    id
    inviteKey
  }
`)

// const projectRegenerateInviteKeyMutation = graphql(`
//   mutation projectRegenerateInviteKey($projectId: ID!) {
//     projectRegenerateInviteKey(projectId: $projectId) {
//       title
//       inviteKey
//     }
//   }
// `)

export const InviteLink = (props: InviteLinkProps) => {
  const project = useFragment(InviteLinkProjectFragment, props.project)
  // const [{ fetching: fetchingRegenerateInviteKey }, regenerateInviteKey] = useMutation(
  //   projectRegenerateInviteKeyMutation,
  // )

  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/projects/join/${project.inviteKey}`

  const handleCopyInviteLink = async () => {
    await navigator.clipboard.writeText(inviteLink)
  }

  const dialogReference = useRef<HTMLDialogElement>(null)
  return (
    <>

<button className="btn btn-outline btn-sm" type="button" onClick={() => dialogReference.current?.showModal()}>
Invite
</button>
<dialog className="modal" ref={dialogReference}>
<div className="modal-box">
<div className="label">
        <label className="label-text" htmlFor="invite-link">
          Invite link
        </label>
      </div>
      <div className="flex items-end gap-2 flex-col">
        <input className="input input-bordered w-full" readOnly value={inviteLink} id="invite-link" />
       <div className="flex gap-2">
        <button className="btn btn-primary btn-sm" onClick={handleCopyInviteLink}>
          Copy link
        </button>

       </div>
      </div>
</div>
<form method="dialog" className="modal-backdrop">
  <button>close</button>
</form>
</dialog>
</>
  )
}
