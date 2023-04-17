import { useQuery } from 'urql'

import { Button, InputField } from '@progwise/timebook-ui'

import { graphql } from '../generated/gql'

interface InviteLinkProps {
  projectId: string
}

const ProjectInviteKeyQueryDocument = graphql(`
  query projectInviteKey($projectId: ID!) {
    project(projectId: $projectId) {
      inviteKey
    }
  }
`)

export const InviteLink = (props: InviteLinkProps) => {
  const [{ data }] = useQuery({
    query: ProjectInviteKeyQueryDocument,
    variables: { projectId: props.projectId },
  })

  const inviteKey = `${process.env.NEXTAUTH_URL}/projects/join/${data?.project?.inviteKey}`

  const copyInviteLink = async () => {
    await navigator.clipboard.writeText(inviteKey)
  }

  return (
    <div className="flex items-center gap-2">
      <h4 className="whitespace-nowrap text-lg font-semibold text-gray-400">Invite link:</h4>
      <InputField variant="primary" readOnly value={inviteKey} />
      <Button variant="secondary" className="whitespace-nowrap" onClick={copyInviteLink}>
        Copy link
      </Button>
    </div>
  )
}
