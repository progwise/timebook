import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useMutation } from 'urql'

import { graphql } from '../../../frontend/generated/gql'

const JoinProjectByInvitationKeyMutation = graphql(`
  mutation projectMembershipJoin($invitationKey: String!) {
    projectMembershipJoin(invitationKey: $invitationKey) {
      id
    }
  }
`)

const JoinProject = () => {
  const router = useRouter()
  const { invitationKey } = router.query

  const [result, joinProject] = useMutation(JoinProjectByInvitationKeyMutation)

  useEffect(() => {
    if (invitationKey) {
      joinProject({ invitationKey: invitationKey.toString() }).then(({ data, error }) => {
        if (error) {
          return error
        }
        router.push(`/projects/${data?.projectMembershipJoin.id}`) // Redirect the user to the projects page after successfully joining the project.
      })
    }
  }, [invitationKey, joinProject, router])

  if (result.error) {
    return (
      <div className="flex h-96 items-center justify-center text-2xl">
        <h1 className="alert alert-error max-w-max">
          An error has occurred: {result.error.message}. Please ask the project owner to send a new invite.
        </h1>
      </div>
    )
  }

  return (
    <div className="flex h-96 items-center justify-center text-2xl">
      <div className="alert alert-info max-w-max">Please wait, you will be added to the project....</div>
    </div>
  )
}

export default JoinProject
