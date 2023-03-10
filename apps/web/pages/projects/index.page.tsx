import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import { Button, Spinner } from '@progwise/timebook-ui'

import { ComboBox } from '../../frontend/components/combobox/combobox'
import { ProjectList } from '../../frontend/components/projectList/projectList'
import { ProjectTable } from '../../frontend/components/projectTable'
import { ProtectedPage } from '../../frontend/components/protectedPage'
import { ProjectFilter, useMyProjectsQuery, useProjectCountsQuery } from '../../frontend/generated/graphql'

const projectFilters = Object.values(ProjectFilter).map((projectFilter) => ({ id: projectFilter }))

const Projects = (): JSX.Element => {
  const context = useMemo(() => ({ additionalTypenames: ['Project'] }), [])
  const [selectedProjectFilter, setSelectedProjectFilter] = useState(ProjectFilter.Active)
  const router = useRouter()
  const from = format(new Date(), 'yyyy-MM-dd')
  const [{ data, error, fetching: projectsLoading }] = useMyProjectsQuery({
    context,
    variables: { from, filter: selectedProjectFilter },
  })
  const [{ data: projectCountsData }] = useProjectCountsQuery({ context, variables: { from } })

  const projectFilterKeyToLabel: Record<ProjectFilter, string> = {
    ALL: `all projects ${projectCountsData ? `(${projectCountsData.allCounts})` : ''}`,
    ACTIVE: `current projects ${projectCountsData ? `(${projectCountsData.activeCounts})` : ''}`,
    FUTURE: `upcoming projects ${projectCountsData ? `(${projectCountsData.futureCounts})` : ''}`,
    PAST: `finished projects ${projectCountsData ? `(${projectCountsData.pastCounts})` : ''}`,
  }

  const handleAddProject = async () => {
    await router.push('/projects/new')
  }

  const handleProjectFilterChange = (newProjectFilter: ProjectFilter | null) => {
    if (newProjectFilter) {
      setSelectedProjectFilter(newProjectFilter)
    }
  }

  return (
    <ProtectedPage>
      <article>
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold text-gray-400 dark:text-white">Projects</h2>
          <Button variant="primary" onClick={handleAddProject}>
            Add
          </Button>
        </div>

        <div className="mb-6 flex">
          <ComboBox<{ id: ProjectFilter }, ProjectFilter>
            value={projectFilters.find((filter) => filter.id === selectedProjectFilter)}
            displayValue={(project) => projectFilterKeyToLabel[project.id]}
            onChange={handleProjectFilterChange}
            options={projectFilters}
          />
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
