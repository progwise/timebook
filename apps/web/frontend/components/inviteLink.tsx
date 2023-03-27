import { useQuery } from 'urql'

import { Button, InputField } from '@progwise/timebook-ui'

import { graphql } from '../generated/gql'

interface InviteLinkProps {
  projectId: string
}

// {projects(from: "2023-03-24") {title,inviteKey}}
const ProjectInviteKeyQueryDocument = graphql(`
  query project($projectId: ID!) {
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

  const inviteKey = data?.project?.inviteKey
  console.log('inviteKey: ', inviteKey)

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
