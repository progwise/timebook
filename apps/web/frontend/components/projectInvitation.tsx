import { useRef } from 'react'
import { BiCopyAlt } from 'react-icons/bi'
import { useMutation } from 'urql'

import { toastSuccess } from '@progwise/timebook-ui'

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
  const [{ data, fetching }, invitationKeyCreate] = useMutation(projectMembershipInvitationMutation)

  const dialogReference = useRef<HTMLDialogElement>(null)

  const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL}/projects/join/${data?.projectMembershipInvitationCreate.invitationKey}`

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
        <div className="modal-box whitespace-normal text-base-content">
          <h3 className="mb-4 text-lg font-bold">Invitation key</h3>
          <div className="text-base">
            <p>Here is the invitation key:</p>
            <div className="my-2 flex items-center">
              <input
                className="input input-bordered grow bg-neutral py-2 text-neutral-content"
                value={invitationLink}
                readOnly
              />
              <button
                className="btn btn-circle btn-ghost gap-2 text-xl"
                onClick={() => {
                  navigator.clipboard.writeText(invitationLink ?? '')
                  toastSuccess('Successfully copied to clipboard!')
                }}
              >
                <BiCopyAlt />
              </button>
            </div>
            <span>Warning: You will no longer be able to see it once you close this dialog window.</span>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost btn-sm" disabled={fetching}>
                Done
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
