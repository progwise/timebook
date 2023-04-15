import { useRouter } from 'next/router'
import { useMutation } from 'urql'
import { useEffect } from 'react'

const JoinProjectByInviteKeyMutation = `
  mutation JoinProjectByInviteKey($inviteKey: String!) {
    joinProjectByInviteKey(inviteKey: $inviteKey) {
      id
    }
  }
`

const JoinProject = () => {
  const router = useRouter()
  const { inviteKey } = router.query

  const [result, joinProject] = useMutation(JoinProjectByInviteKeyMutation)

  useEffect(() => {
    if (inviteKey) {
      joinProject({ inviteKey }).then(() => {
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
