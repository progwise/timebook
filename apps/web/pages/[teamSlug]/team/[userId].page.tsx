import Image from 'next/image'
import { useRouter } from 'next/router'

import { Button } from '@progwise/timebook-ui'

import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { Toggle } from '../../../frontend/components/toggle/toggle'
import {
  Role,
  useMeQuery,
  useProjectMembershipCreateMutation,
  useProjectMembershipDeleteMutation,
  useTeamProjectsQuery,
  useUserQuery,
  useUserRoleUpdateMutation,
} from '../../../frontend/generated/graphql'

const UserDetailsPage = (): JSX.Element => {
  const router = useRouter()

  const { userId: queryUserId } = router.query
  const userId = queryUserId?.toString() ?? '' // hack: better solution?
  const teamSlug = router.query.teamSlug?.toString() ?? ''

  const [{ error, fetching }, userRoleUpdate] = useUserRoleUpdateMutation()
  const [{ data: meData }] = useMeQuery({ variables: { teamSlug } })
  const [{ data: allProjects }] = useTeamProjectsQuery({ variables: { slug: teamSlug } })
  const [{ data }] = useUserQuery({
    pause: !router.isReady,
    variables: { userId, teamSlug },
  })
  const isAdmin = meData?.user.role === Role.Admin
  const [, createProjectMembership] = useProjectMembershipCreateMutation()
  const [, deleteProjectMembership] = useProjectMembershipDeleteMutation()

  const handleUpgradeClick = () => {
    userRoleUpdate({ role: Role.Admin, userId, teamSlug })
    router.push(`/${teamSlug}/team/${userId}`)
  }

  const handleDowngradeClick = () => {
    userRoleUpdate({ role: Role.Member, userId, teamSlug })
  }

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
            <div className="w-full">
              <h1 className="text-4xl dark:text-blue-400">{data?.user.name}</h1>

              <div className="my-1  border border-gray-400 dark:border-blue-400 " />

              <div className="flex justify-between">
                <h1 className="text-xl font-semibold text-gray-400">Team member</h1>

                <div className="flex">
                  {isAdmin && (
                    <>
                      {data?.user.role === Role.Member ? (
                        <Button className="mr-4" variant="secondary" onClick={handleUpgradeClick}>
                          Promote to admin
                        </Button>
                      ) : (
                        <Button className="mr-4" variant="secondary" onClick={handleDowngradeClick}>
                          Demote to member
                        </Button>
                      )}
                    </>
                  )}

                  <Button variant="danger">Remove from team</Button>
                </div>
              </div>
            </div>
          </div>
          {isAdmin ? (
            <>
              <h1 className="text-xl font-semibold text-gray-400"> All Projects:</h1>
              <ul>
                {allProjects?.teamBySlug.projects.map((project) => (
                  <li key={project.id} className="p-3">
                    <span className=" inline-block w-32"> {project.title} </span>
                    <Toggle
                      checked={data?.user.projects.some((userProject) => userProject.id === project.id) ?? false}
                      onChange={(newValue) => {
                        if (!data?.user) {
                          return
                        }
                        if (newValue === false) {
                          deleteProjectMembership({ projectID: project.id, userID: data?.user.id })
                        } else {
                          createProjectMembership({ projectID: project.id, userID: data?.user.id })
                        }
                      }}
                    />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold text-gray-400"> Assigned Projects:</h1>
              <ul>
                {data?.user.projects.map((project) => (
                  <li key={project.id}> {project.title}</li>
                ))}
              </ul>
            </>
          )}
        </article>
        {fetching && <span>Loading...</span>}
        {error && <span className="text-red-600">{error.message}!</span>}
      </ProtectedPage>
    </>
  )
}
export default UserDetailsPage