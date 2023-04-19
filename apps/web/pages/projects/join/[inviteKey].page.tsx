import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useMutation } from 'urql'

import { graphql } from '../../../frontend/generated/gql'

const JoinProjectByInviteKeyMutation = graphql(`
  mutation projectMembershipJoin($inviteKey: String!) {
    projectMembershipJoin(inviteKey: $inviteKey) {
      id
    }
  }
`)

const JoinProject = () => {
  const router = useRouter()
  const { inviteKey } = router.query

  const [result, joinProject] = useMutation(JoinProjectByInviteKeyMutation)

  useEffect(() => {
    if (inviteKey) {
      joinProject({ inviteKey: inviteKey.toString() }).then(() => {
        router.push('/projects') // Redirect the user to the projects page after successfully joining the project.
      })
    }
  }, [inviteKey, joinProject, router])

  if (result.error) {
    return <div>An error has occurred: {result.error.message}</div>
  }

  return <div>Please wait, you will be added to the project....</div>
}

export default JoinProject
