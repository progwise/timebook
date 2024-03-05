import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { FaFolderClosed, FaFolderMinus, FaFolderOpen, FaFolderPlus, FaFolderTree } from 'react-icons/fa6'
import { useQuery } from 'urql'

import { Listbox } from '@progwise/timebook-ui'

import { PageHeading } from '../../frontend/components/pageHeading'
import { ProjectTable } from '../../frontend/components/projectTable'
import { ProtectedPage } from '../../frontend/components/protectedPage'
import { graphql } from '../../frontend/generated/gql'
import { ProjectFilter } from '../../frontend/generated/gql/graphql'

const MyProjectsQueryDocument = graphql(`
  query myProjects($from: Date!, $filter: ProjectFilter) {
    projects(from: $from, filter: $filter) {
      ...ProjectTableItem
    }
  }
`)

const projectCountsQueryDocument = graphql(`
  query projectCounts($from: Date!, $to: Date) {
    allCounts: projectsCount(from: $from, to: $to, filter: ALL)
    activeCounts: projectsCount(from: $from, to: $to, filter: ACTIVE)
    futureCounts: projectsCount(from: $from, to: $to, filter: FUTURE)
    pastCounts: projectsCount(from: $from, to: $to, filter: PAST)
    archivedCounts: projectsCount(from: $from, to: $to, filter: ARCHIVED)
  }
`)

type DisplayedProjectFilter = Exclude<ProjectFilter, ProjectFilter.ActiveOrArchived>

const Projects = (): JSX.Element => {
  const context = useMemo(() => ({ additionalTypenames: ['Project'] }), [])
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<DisplayedProjectFilter>(ProjectFilter.Active)
  const router = useRouter()
  const from = format(new Date(), 'yyyy-MM-dd')
  const [{ data, error, fetching: projectsLoading }] = useQuery({
    query: MyProjectsQueryDocument,
    context,
    variables: { from, filter: selectedProjectFilter },
  })
  const [{ data: projectCountsData }] = useQuery({
    query: projectCountsQueryDocument,
    context,
    variables: { from },
  })

  const projectFilterKeyToLabel: Record<DisplayedProjectFilter, string | JSX.Element> = {
    ALL: (
      <>
        <FaFolderTree className="inline" /> all projects {projectCountsData ? `(${projectCountsData.allCounts})` : ''}
      </>
    ),
    ACTIVE: (
      <>
        <FaFolderOpen className="inline" /> current projects{' '}
        {projectCountsData ? `(${projectCountsData.activeCounts})` : ''}
      </>
    ),
    FUTURE: (
      <>
        <FaFolderPlus className="inline" /> upcoming projects{' '}
        {projectCountsData ? `(${projectCountsData.futureCounts})` : ''}
      </>
    ),
    PAST: (
      <>
        <FaFolderClosed className="inline" /> finished projects{' '}
        {projectCountsData ? `(${projectCountsData.pastCounts})` : ''}
      </>
    ),
    ARCHIVED: (
      <>
        <FaFolderMinus className="inline" /> archived projects{' '}
        {projectCountsData ? `(${projectCountsData.archivedCounts})` : ''}
      </>
    ),
  }

  const handleAddProject = async () => {
    await router.push('/projects/new')
  }

  return (
    <ProtectedPage>
      <article>
        <PageHeading>Projects</PageHeading>
        <div className="flex items-center justify-between gap-4">
          <button className="btn btn-primary btn-sm" onClick={handleAddProject}>
            New project
          </button>
          <Listbox
            value={selectedProjectFilter}
            getLabel={(projectFilter) => projectFilterKeyToLabel[projectFilter]}
            getKey={(projectFilter) => projectFilter}
            onChange={(projectFilter) => setSelectedProjectFilter(projectFilter)}
            options={Object.values(ProjectFilter).filter(
              (filter): filter is DisplayedProjectFilter => filter !== ProjectFilter.ActiveOrArchived,
            )}
          />
        </div>

        {error && <span>{error.message}</span>}
        {projectsLoading && <span className="loading loading-spinner" />}
        {data &&
          (data.projects.length === 0 ? <div>No projects found</div> : <ProjectTable projects={data.projects} />)}
      </article>
    </ProtectedPage>
  )
}

export default Projects
