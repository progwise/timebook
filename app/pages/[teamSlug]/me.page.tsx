import { useMeQuery } from '../../frontend/generated/graphql'
import Image from 'next/image'
import { useRouter } from 'next/router'

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
      <div className="mt-10">
        <h2 className="mb-5 font-bold">Projects</h2>
        <ul>
          {userData?.user.projects.map((project) => (
            <li key={project.id}>{project.title}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
export default MyProfilePage
