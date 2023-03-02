import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

import { Button, Spinner } from '@progwise/timebook-ui'

import { ProjectList } from '../../frontend/components/projectList/projectList'
import { ProjectTable } from '../../frontend/components/projectTable'
import { ProtectedPage } from '../../frontend/components/protectedPage'
import { ProjectFilter, useMyProjectsQuery } from '../../frontend/generated/graphql'
import { format } from 'date-fns'

const Projects = (): JSX.Element => {
  const context = useMemo(() => ({ additionalTypenames: ['Project'] }), [])
  const router = useRouter()
  const [{ data, error, fetching: projectsLoading }] = useMyProjectsQuery({
    context,
    variables: { from: format(new Date(), 'yyyy-MM-dd'), filter: ProjectFilter.All },
  })

  const handleAddProject = async () => {
    await router.push('/projects/new')
  }

  return (
    <ProtectedPage>
      <article className="timebook">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-gray-400 dark:text-white">All Projects</h2>
          <Button variant="primary" onClick={handleAddProject}>
            Add
          </Button>
        </div>

        {error && <span>{error.message}</span>}
        {projectsLoading && <Spinner />}
        {data && (
          <>
            {data.projects.length === 0 ? (
              <div>No projects found</div>
            ) : (
              <>
                <ProjectList className="mb-6 " projects={data.projects} />
                <ProjectTable projects={data.projects} />
              </>
            )}
          </>
        )}
      </article>
    </ProtectedPage>
  )
}

export default Projects
