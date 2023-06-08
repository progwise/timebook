import { useState } from 'react'
import { gql, useMutation } from 'urql'

import { Button, InputField } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../generated/gql'

interface InviteLinkProps {
  project: FragmentType<typeof InviteLinkProjectFragment>
}

const InviteLinkProjectFragment = graphql(`
  fragment InviteLinkProjectFragment on Project {
    id
    inviteKey
  }
`)

const GENERATE_INVITE_LINK = gql`
  mutation projectGenerateNewInvitationKey($projectId: ID!) {
    generateNewInvitationKey(projectId: $projectId) {
      inviteLink
    }
  }
`

export const InviteLink = (props: InviteLinkProps) => {
  const project = useFragment(InviteLinkProjectFragment, props.project)
  const [inviteLink, setInviteLink] = useState<string>(`${process.env.NEXTAUTH_URL}/projects/join/${project.inviteKey}`)
  const [generateNewInvitationKeyMutation] = useMutation(GENERATE_INVITE_LINK)

  const copyInviteLink = async () => {
    await navigator.clipboard.writeText(inviteLink)
  }

  const regenerateNewInvitationKey = async () => {
    try {
      const { data } = await generateNewInvitationKeyMutation({
        variables: { projectId: project.id },
      })
      const newInviteLink = data.generateNewInvitationKey.inviteLink
      setInviteLink(newInviteLink)
    } catch (error) {
      console.error('Error generating invite link:', error)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <h4 className="whitespace-nowrap text-lg font-semibold text-gray-400">Invite link:</h4>
      <InputField variant="primary" readOnly value={inviteLink} />
      <Button variant="secondary" className="whitespace-nowrap" onClick={copyInviteLink}>
        Copy link
      </Button>
      <Button variant="secondary" className="whitespace-nowrap" onClick={regenerateNewInvitationKey}>
        Regenerate link
      </Button>
    </div>
  )
}
