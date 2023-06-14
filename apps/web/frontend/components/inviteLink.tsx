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

const projectRegenerateInviteKeyMutation = graphql(`
  mutation projectRegenerateInviteKey($projectId: ID!) {
    projectRegenerateInviteKey(projectId: $projectId) {
      title
      inviteKey
    }
  }
`)

export const InviteLink = (props: InviteLinkProps) => {
  const project = useFragment(InviteLinkProjectFragment, props.project)
  const inviteLink = `${process.env.NEXTAUTH_URL}/projects/join/${project.inviteKey}`

  const handleCopyInviteLink = async () => {
    await navigator.clipboard.writeText(inviteLink)
  }

  const handleRegenerateClick = async () => {}

  return (
    <div className="flex items-center gap-2">
      <h4 className="whitespace-nowrap text-lg font-semibold text-gray-400">Invite link:</h4>
      <InputField variant="primary" readOnly value={inviteLink} />
      <Button variant="secondary" className="whitespace-nowrap" onClick={handleCopyInviteLink}>
        Copy link
      </Button>
      <Button variant="secondary" className="whitespace-nowrap" onClick={handleRegenerateClick}>
        Regenerate link
      </Button>
    </div>
  )
}
