import { formatDistanceToNow } from 'date-fns'
import { useRef } from 'react'
import { BiCopyAlt } from 'react-icons/bi'
import { useMutation } from 'urql'

import { InputField, toastSuccess } from '@progwise/timebook-ui'

import { graphql } from '../generated/gql'

export const projectMembershipInvitationMutation = graphql(`
  mutation projectMembershipInvitationCreate($projectId: ID!) {
    projectMembershipInvitationCreate(projectId: $projectId) {
      id
      invitationKey
      expireDate
    }
  }
`)

interface ProjectInvitationButtonProps {
  projectId: string
}

export const ProjectInvitationButton = ({ projectId }: ProjectInvitationButtonProps) => {
  const [{ data, fetching: invitationLoading, error }, invitationKeyCreate] = useMutation(
    projectMembershipInvitationMutation,
  )

  const dialogReference = useRef<HTMLDialogElement>(null)

  const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL}/projects/join/${data?.projectMembershipInvitationCreate.invitationKey}`

  const invitationExpireDate = data && formatDistanceToNow(new Date(data.projectMembershipInvitationCreate.expireDate))

  return (
    <>
      <button
        className="btn btn-outline btn-sm"
        type="button"
        onClick={() => {
          dialogReference.current?.showModal()
          invitationKeyCreate({ projectId })
        }}
      >
        Invite
      </button>
      <dialog className="modal" ref={dialogReference}>
        {error ? (
          <div className="modal-box">
            <span className="alert alert-error">Unable to create invitation link.</span>
          </div>
        ) : (
          <div className="modal-box whitespace-normal text-base-content">
            <h3 className="mb-4 text-lg font-bold">Invitation link</h3>
            <div className="text-base">
              <div className="my-4 flex items-center">
                <InputField
                  className="input input-bordered grow bg-neutral py-2 text-neutral-content"
                  value={invitationLoading ? '' : invitationLink}
                  readOnly
                  loading={invitationLoading}
                />
                <button
                  className="btn btn-circle btn-ghost gap-2 text-xl"
                  onClick={() => {
                    navigator.clipboard.writeText(invitationLink)
                    toastSuccess('Successfully copied to clipboard!')
                  }}
                >
                  <BiCopyAlt />
                </button>
              </div>
              {!invitationLoading && (
                <span className="mx-2">This invitation link will expire in ${invitationExpireDate}`</span>
              )}
            </div>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-ghost btn-sm">Done</button>
              </form>
            </div>
          </div>
        )}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
