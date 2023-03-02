import Image from 'next/image'
import { useRouter } from 'next/router'

import { useMeQuery } from '../../frontend/generated/graphql'

const MyProfilePage = (): JSX.Element => {
  const router = useRouter()
  const teamSlug = router.query.teamSlug?.toString() ?? ''
  const [{ data: userData, fetching }] = useMeQuery({ variables: { teamSlug }, pause: !router.isReady })

  if (fetching) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="mt-3 flex flex-row items-center gap-3">
        {userData?.user.image ? (
          <Image
            className="rounded-full"
            width={90}
            height={90}
            src={userData?.user.image}
            alt={userData?.user.name ?? 'Profile picture'}
          />
        ) : undefined}
        <h1 className="text-xl">{userData?.user.name}</h1>
      </div>
    </div>
  )
}
export default MyProfilePage
