import React from 'react'
import { useRouter } from 'next/router'
import { Button } from '../../../../frontend/components/button/button'
import { ProtectedPage } from '../../../../frontend/components/protectedPage'
import { useTeamAcceptInviteMutation } from '../../../../frontend/generated/graphql'

const AcceptInvitationPage = (): JSX.Element => {
  const router = useRouter()
  const [, acceptInvite] = useTeamAcceptInviteMutation()

  const handleClick = async () => {
    const inviteKey: string | undefined = router.query.inviteKey?.toString()
    if (inviteKey === undefined) {
      throw new Error('error! invite key is undefined!')
    }
    const inviteResult = await acceptInvite({ inviteKey })

    if (inviteResult.data === undefined) {
      throw new Error('error! data is undefined!')
    }

    const slug = inviteResult.data.teamAcceptInvite.slug

    await router.push(`/${slug}/team`)
  }

  return (
    <ProtectedPage>
      <div className="mt-16 flex justify-center gap-2">
        <h1>Do you want to join this team?</h1>
      </div>

      <div className="mt-16 flex justify-center gap-2">
        <Button ariaLabel="Accept" variant="primary" onClick={handleClick}>
          Accept
        </Button>
        <Button ariaLabel="Decline" variant="danger" onClick={() => router.push('/home')}>
          Decline
        </Button>
      </div>
    </ProtectedPage>
  )
}

export default AcceptInvitationPage
