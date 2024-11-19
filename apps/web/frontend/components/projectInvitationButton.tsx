import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { BiCopyAlt } from 'react-icons/bi'
import { FaXmark } from 'react-icons/fa6'
import { useMutation } from 'urql'

import { InputField, toastSuccess } from '@progwise/timebook-ui'

import { graphql } from '../generated/gql'
import { Role } from '../generated/gql/graphql'

export const ProjectMembershipInvitationMutation = graphql(`
  mutation projectMembershipInvitationCreate($projectId: ID!) {
    projectMembershipInvitationCreate(projectId: $projectId) {
      id
      invitationKey
      expireDate
      project {
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
    }
  }
`)

const ProjectMembershipCreateMutationDocument = graphql(`
  mutation projectMembershipCreate($projectId: ID!, $userId: ID!, $projectRole: Role!) {
    projectMembershipCreate(projectId: $projectId, userId: $userId, projectRole: $projectRole) {
      id
    }
  }
`)

interface ProjectInvitationButtonProps {
  projectId: string
}

export const ProjectInvitationButton = ({ projectId }: ProjectInvitationButtonProps) => {
  const [{ data, fetching: invitationLoading, error }, invitationKeyCreate] = useMutation(
    ProjectMembershipInvitationMutation,
  )

  const [{ fetching: projectMembershipCreateFetching }, projectMembershipCreate] = useMutation(
    ProjectMembershipCreateMutationDocument,
  )

  const [clicked, setClicked] = useState(false)

  const dialogReference = useRef<HTMLDialogElement>(null)

  const invitationLink = `${process.env.NEXT_PUBLIC_APP_URL}/projects/join/${data?.projectMembershipInvitationCreate.invitationKey}`

  const invitationExpireDate = data && formatDistanceToNow(new Date(data.projectMembershipInvitationCreate.expireDate))

  const project = data?.projectMembershipInvitationCreate.project

  const organizationMembersNotInProject = project?.organization?.members.filter(
    (organizationMember) => !project.members.some((projectMember) => projectMember.id === organizationMember.id),
  )

  const handleCreateProjectMembership = async (userId: string, projectRole: Role) => {
    const projectId = project?.id
    if (!projectId) {
      return
    }
    await projectMembershipCreate({
      projectId,
      userId,
      projectRole,
    })
  }

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
                Invite {project?.organization?.title ?? ''} members to {project?.title}
              </h3>
              <form method="dialog">
                <button className="btn btn-square btn-ghost btn-sm text-xl">
                  <FaXmark />
                </button>
              </form>
            </div>
            {project?.organization && organizationMembersNotInProject && (
              <>
                <div className="max-h-96 overflow-y-auto">
                  <table className="table">
                    <tbody>
                      {organizationMembersNotInProject.map((user) => (
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
                              className={`btn btn-secondary btn-sm ${clicked ? 'btn-success no-animation' : ''}`}
                              onClick={() => {
                                handleCreateProjectMembership(user.id, Role.Member)
                                setClicked(true)
                              }}
                              disabled={projectMembershipCreateFetching || clicked}
                            >
                              {clicked ? 'Added' : 'Invite'}
                            </button>
                          </td>
                        </tr>
                      ))}
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
