import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { BiCopyAlt } from 'react-icons/bi'
import { FaXmark } from 'react-icons/fa6'
import { useMutation } from 'urql'

import { InputField, toastSuccess } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../generated/gql'

const ProjectMembershipInvitationMutation = graphql(`
  mutation projectMembershipInvitationCreate($projectId: ID!) {
    projectMembershipInvitationCreate(projectId: $projectId) {
      id
      invitationKey
      expireDate
    }
  }
`)

const ProjectMembershipCreateMutationDocument = graphql(`
  mutation projectMembershipCreate($projectId: ID!, $userId: ID!) {
    projectMembershipCreate(projectId: $projectId, userId: $userId) {
      id
    }
  }
`)

export const ProjectInvitationButtonFragment = graphql(`
  fragment ProjectInvitationButton on Project {
    id
    title
    members {
      id
      projectRole(projectId: $projectId)
    }
    organization {
      title
      members {
        id
        name
        image
      }
    }
  }
`)

interface ProjectInvitationButtonProps {
  projectId: string
  project: FragmentType<typeof ProjectInvitationButtonFragment>
}

export const ProjectInvitationButton = (props: ProjectInvitationButtonProps) => {
  const [{ data, fetching: invitationLoading, error }, invitationKeyCreate] = useMutation(
    ProjectMembershipInvitationMutation,
  )
  const [, projectMembershipCreate] = useMutation(ProjectMembershipCreateMutationDocument)
  const project = useFragment(ProjectInvitationButtonFragment, props.project)
  const [addedUserIds, setAddedUserIds] = useState<string[]>([])
  const dialogReference = useRef<HTMLDialogElement>(null)

  const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL}/projects/join/${data?.projectMembershipInvitationCreate.invitationKey}`
  const invitationExpireDate = data && formatDistanceToNow(new Date(data.projectMembershipInvitationCreate.expireDate))

  const usersToAdd =
    project.organization?.members.filter((organizationMember) => {
      const isMemberInProject = project.members.some((projectMember) => projectMember.id === organizationMember.id)
      const wasRecentlyAdded = addedUserIds.includes(organizationMember.id)
      return !isMemberInProject || wasRecentlyAdded
    }) ?? []

  const handleCreateProjectMembershipClick = async (userId: string) => {
    await projectMembershipCreate({
      projectId: project.id,
      userId,
    })
    setAddedUserIds((previous) => [...previous, userId])
  }

  return (
    <>
      <button
        className="btn btn-outline btn-sm"
        type="button"
        onClick={() => {
          dialogReference.current?.showModal()
          invitationKeyCreate({ projectId: project.id })
          setAddedUserIds([])
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
              <h3 className="text-lg font-bold">Add members to {project?.title}</h3>
              <form method="dialog">
                <button className="btn btn-square btn-ghost btn-sm text-xl">
                  <FaXmark />
                </button>
              </form>
            </div>
            {usersToAdd.length > 0 && (
              <>
                <div className="max-h-96 overflow-y-auto">
                  <table className="table">
                    <tbody>
                      {usersToAdd.map((user) => {
                        const hasUserBeenAdded = addedUserIds.includes(user.id)
                        return (
                          <tr key={user.id}>
                            <td className="flex w-full items-center gap-2 pl-0">
                              {user.image ? (
                                <div className="avatar">
                                  <Image
                                    className="rounded-box"
                                    width={32}
                                    height={32}
                                    src={user.image}
                                    alt={user.name ?? 'image of the user'}
                                  />
                                </div>
                              ) : (
                                <div className="avatar placeholder">
                                  <div className="size-8 rounded-box bg-neutral text-neutral-content" />
                                </div>
                              )}
                              {user.name}
                            </td>
                            <td className="w-0 pr-0">
                              <button
                                className={`btn btn-secondary btn-sm ${hasUserBeenAdded ? 'btn-success no-animation' : ''}`}
                                onClick={() => {
                                  handleCreateProjectMembershipClick(user.id)
                                }}
                                disabled={hasUserBeenAdded}
                              >
                                {hasUserBeenAdded ? 'Added' : 'Add'}
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <span className="mt-4">Or send a direct invitation link:</span>
              </>
            )}
            <div className="relative my-1 flex items-center">
              <InputField
                className="input input-bordered grow bg-neutral pr-14 text-neutral-content"
                value={invitationLoading ? '' : invitationLink}
                readOnly
                loading={invitationLoading}
              />
              <button
                className="btn btn-square btn-primary btn-sm absolute right-0 m-2 text-xl"
                onClick={() => {
                  navigator.clipboard.writeText(invitationLink)
                  toastSuccess('Successfully copied to clipboard!')
                }}
              >
                <BiCopyAlt />
              </button>
            </div>
            {!invitationLoading && (
              <span className="text-xs">This invitation link will expire in {invitationExpireDate}</span>
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
