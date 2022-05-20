import { useUserQuery } from '../../../frontend/generated/graphql'
import Image from 'next/image'
import { Button } from '../../../frontend/components/button/button'
import { useRouter } from 'next/router'
import { ProtectedPage } from '../../../frontend/components/protectedPage'

const UserDetailsPage = (): JSX.Element => {
  const router = useRouter()

  const { userId } = router.query

  const [{ data }] = useUserQuery({
    pause: !router.isReady,
    variables: { userId: userId?.toString() ?? '' },
  })

  return (
    <>
      <ProtectedPage>
        <article>
          <div className="flex justify-start pt-10">
            <span className="pr-8 ">
              {data?.user.image ? (
                <Image width={40} height={40} src={data?.user.image} alt={data?.user.id} />
              ) : undefined}
            </span>
            <h1 className="text-4xl text-blue-400">{data?.user.name}</h1>
          </div>
          <h1 className="text-xl font-semibold text-gray-400">Projects:</h1>
          <ul>
            {data?.user.projects.map((project) => (
              <li key={project.id}> {project.title}</li>
            ))}
          </ul>
        </article>
        <div className="flex justify-between pt-20">
          <div className="flex justify-center">
            <Button className="mx-4" variant="primary">
              Upgrade
            </Button>
            <Button variant="secondary">Downgrade</Button>
          </div>
          <div>
            <Button variant="danger">Kick from Team</Button>
          </div>
        </div>
      </ProtectedPage>
    </>
  )
}
export default UserDetailsPage
