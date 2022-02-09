import { useRouter } from 'next/router'
import { useMeQuery } from '../../frontend/generated/graphql'
import Image from 'next/image'

const MyProfilePage = (): JSX.Element => {
  const router = useRouter()
  const [{ data: userData }] = useMeQuery()

  if (!router.isReady) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="mt-3 flex flex-row items-center gap-3">
        {userData?.user.image ? (
          <Image className="rounded-full" width={90} height={90} src={userData?.user.image} alt="Profile picture" />
        ) : undefined}
        <h1 className="text-xl">{userData?.user.name}</h1>
      </div>
      <div className="mt-10">
        <h2 className="mb-5 font-bold">Projects</h2>
        {userData?.user.projects.map((project) => (
          <ul key={project.id}>
            <li>{project.title}</li>
          </ul>
        ))}
      </div>
    </div>
  )
}
export default MyProfilePage
