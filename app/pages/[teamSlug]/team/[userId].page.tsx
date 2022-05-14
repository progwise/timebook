import { useRouter } from 'next/router'
import { useTeamQuery } from '../../../frontend/generated/graphql'
import Image from 'next/image'
import { Button } from '../../../frontend/components/button/button'
const UserDetailsPage = (): JSX.Element => {
  const router = useRouter()
  const { userId } = router.query
  const [{ data: teamData, fetching, error }] = useTeamQuery()

  if (fetching) {
    return <div>Loading...</div>
  }
  if (error) {
    return <h1>User not found</h1>
  }

  return (
    <>
      <article>
        {teamData?.team.members.map((user) => (
          <div key={user.id} className="flex justify-start pt-10">
            <span className="pr-8 ">
              {user.image ? <Image width={40} height={40} src={user.image} alt={'Profile picture'} /> : undefined}
            </span>
            <h1 className="text-4xl text-blue-400">{user.name}</h1>
          </div>
        ))}
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
