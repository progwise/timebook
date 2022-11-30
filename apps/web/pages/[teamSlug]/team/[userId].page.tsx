import { useRouter } from 'next/router'

import { Spinner } from '@progwise/timebook-ui'

import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { useUserQuery } from '../../../frontend/generated/graphql'
import { UserOverview } from '../../../frontend/userOverview'

const UserDetailsPage = (): JSX.Element => {
  const router = useRouter()

  const { userId: queryUserId } = router.query
  const userId = queryUserId?.toString() ?? '' // hack: better solution?
  const teamSlug = router.query.teamSlug?.toString() ?? ''

  const [{ data }] = useUserQuery({
    pause: !router.isReady,
    variables: { userId, teamSlug },
  })

  if (!data) return <Spinner />

  return (
    <ProtectedPage>
      <UserOverview user={data.user} />
    </ProtectedPage>
  )
}
export default UserDetailsPage
