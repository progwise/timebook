import { formatDistanceToNow } from 'date-fns'
import { useRef } from 'react'
import { BiCopyAlt } from 'react-icons/bi'
import { FaXmark } from 'react-icons/fa6'
import { useMutation } from 'urql'

import { InputField, toastSuccess } from '@progwise/timebook-ui'

import { graphql } from '../generated/gql'

export const projectMembershipInvitationMutation = graphql(`
  mutation projectMembershipInvitationCreate($projectId: ID!) {
    projectMembershipInvitationCreate(projectId: $projectId) {
      id
      invitationKey
      expireDate
      project {
        title
        organization {
          title
        }
      }
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
        Add members
      </button>
      <dialog className="modal" ref={dialogReference}>
        {error ? (
          <div className="modal-box">
            <span className="alert alert-error">Unable to create invitation link.</span>
          </div>
        ) : (
          <div className="modal-box flex flex-col whitespace-normal">
            <div className="modal-action mt-0 flex items-center justify-between">
              <h3 className="text-lg font-bold">
                Invite {data?.projectMembershipInvitationCreate.project.organization?.title ?? ''} members to{' '}
                {data?.projectMembershipInvitationCreate?.project?.title}
              </h3>
              <form method="dialog">
                <button className="btn btn-square btn-ghost btn-sm text-xl">
                  <FaXmark />
                </button>
              </form>
            </div>
            {data?.projectMembershipInvitationCreate.project.organization && (
              <div className="max-h-96 overflow-y-auto">
                <table className="table">
                  <tbody>
                    <tr>
                      <td>test</td>
                      <td>table</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4">
              <span>Or send a direct invitation link:</span>
              <div className="relative mt-2 flex items-center">
                <InputField
                  className="input input-bordered grow bg-neutral pr-12 text-neutral-content"
                  value={invitationLoading ? '' : invitationLink}
                  readOnly
                  loading={invitationLoading}
                />
                <button
                  className="btn btn-square btn-primary btn-sm absolute right-0 top-0 mx-2 mt-2 text-xl text-neutral-content"
                  onClick={() => {
                    navigator.clipboard.writeText(invitationLink)
                    toastSuccess('Successfully copied to clipboard!')
                  }}
                >
                  <BiCopyAlt />
                </button>
              </div>
            </div>
            {!invitationLoading && (
              <span className="mt-1 text-xs">This invitation link will expire in {invitationExpireDate}</span>
            )}
          </div>
        )}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
