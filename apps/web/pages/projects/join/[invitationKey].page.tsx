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
      joinProject({ invitationKey: invitationKey.toString() }).then(() => {
        router.push('/projects/') // Redirect the user to the projects page after successfully joining the project.
      })
    }
  }, [invitationKey, joinProject, router])

  if (result.error) {
    return <div>An error has occurred: {result.error.message}</div>
  }

  return <div>Please wait, you will be added to the project....</div>
}

export default JoinProject
