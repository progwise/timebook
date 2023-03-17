import { useEffect, useState } from 'react'

import { Button, InputField } from '@progwise/timebook-ui'

interface InviteLinkProps {
  projectId: string
}

export const InviteLink = (props: InviteLinkProps) => {
  const [link, setLink] = useState<string>()

  const copyInviteLink = async () => {
    if (link) {
      await navigator.clipboard.writeText(link)
    }
  }

  useEffect(() => {
    const fetchLink = async () => {
      const inviteLink = await generateInviteLink(props.projectId)
      setLink(inviteLink)
    }

    fetchLink()
  }, [props.projectId])

  return (
    <div className="flex items-center gap-2">
      <h4 className="whitespace-nowrap text-lg font-semibold text-gray-400">Invite link:</h4>
      <InputField variant="primary" readOnly value={link} />
      <Button variant="secondary" className="whitespace-nowrap" onClick={copyInviteLink}>
        Copy link
      </Button>
    </div>
  )
}
