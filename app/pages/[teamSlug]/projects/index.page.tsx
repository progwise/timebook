import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { useProjectsQuery, useTeamQuery } from '../../../frontend/generated/graphql'
import { ProjectTable } from '../../../frontend/components/projectTable'
import { Button } from '../../../frontend/components/button/button'
import { ProjectList } from '../../../frontend/components/projectList/projectList'

const Projects = (): JSX.Element => {
  const context = useMemo(() => ({ additionalTypenames: ['Project'] }), [])
  const [{ data, error }] = useProjectsQuery({ context })
  const router = useRouter()

  const [{ data: teamData }] = useTeamQuery({ pause: !router.isReady })
  const handleAddProject = async () => {
    await router.push(`/${router.query.teamSlug}/projects/new`)
  }

  return (
    <ProtectedPage>
      <article className="timebook">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-gray-400">Team projects for {teamData?.team.title}</h2>
          {teamData?.team.canModify && (
            <Button variant="primary" onClick={handleAddProject}>
              Add
            </Button>
          )}
        </div>

        {error && <span>{error.message}</span>}
        {!data?.projects ? (
          <div>...loading</div>
        ) : (data.projects.length === 0 ? (
          <div>No projects in team {teamData?.team.title}</div>
        ) : (
          <>
            <ProjectList className="mb-6" projects={data.projects} />
            <ProjectTable projects={data.projects} />
          </>
        ))}
      </article>
    </ProtectedPage>
  )
}

export default Projects
