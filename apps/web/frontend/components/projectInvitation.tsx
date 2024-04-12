import { useRef } from 'react'
import { useMutation } from 'urql'

import { FragmentType, graphql, useFragment } from '../generated/gql'

export const ProjectInvitationFragment = graphql(`
  fragment ProjectInvitationFragment on Project {
    id
  }
`)

const projectMembershipInvitationMutation = graphql(`
  mutation projectMembershipInvitation($projectId: ID!) {
    projectMembershipInvitationCreate(projectId: $projectId) {
      id
      invitationKey
      expireDate
    }
  }
`)

interface ProjectInvitationProps {
  project: FragmentType<typeof ProjectInvitationFragment>
}

export const ProjectInvitation = (props: ProjectInvitationProps) => {
  const project = useFragment(ProjectInvitationFragment, props.project)
  const [{ data }, invitationKeyCreate] = useMutation(projectMembershipInvitationMutation)

  const dialogReference = useRef<HTMLDialogElement>(null)
  return (
    <>
      <button
        className="btn btn-outline btn-sm"
        type="button"
        onClick={() => {
          dialogReference.current?.showModal()
          invitationKeyCreate({ projectId: project.id })
        }}
      >
        Invite
      </button>
      <dialog className="modal" ref={dialogReference}>
        <div className="modal-box">
          <div className="label">
            <label className="label-text" htmlFor="invitation-link">
              Invitation link
            </label>
          </div>
          <div className="flex flex-col items-end gap-2">
            <input
              className="input input-bordered w-full"
              readOnly
              value={data?.projectMembershipInvitationCreate.invitationKey}
              id="invitation-link"
            />
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm" onClick={() => console.log('Invite key copied')}>
                Copy
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
