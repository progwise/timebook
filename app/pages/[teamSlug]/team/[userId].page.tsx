import { useUserQuery } from '../../../frontend/generated/graphql'
import Image from 'next/image'
import { Button } from '../../../frontend/components/button/button'
import { useRouter } from 'next/router'

const UserDetailsPage = (): JSX.Element => {
  const router = useRouter()

  const { userId } = router.query

  const [{ data, error, fetching }] = useUserQuery({
    pause: !router.isReady,
    variables: { userId: userId?.toString() ?? '' },
  })

  return (
    <>
      <article>
        <div className="flex justify-start pt-10">
          <span className="pr-8 ">
            {data?.user.image ? (
              <Image width={40} height={40} src={data?.user.image} alt={'Profile picture'} />
            ) : undefined}
          </span>
          <h1 className="text-4xl text-blue-400">{data?.user.name}</h1>
        </div>
      </article>
      <div className="flex justify-between pt-20">
        <div className="flex justify-center">
          <Button className="mx-4" variant={'primary'}>
            Upgrade
          </Button>
          <Button variant={'secondary'}>Downgrade</Button>
        </div>
        <div>
          <Button variant="danger">Kick from Team</Button>
        </div>
      </div>
    </>
  )
}
export default UserDetailsPage
