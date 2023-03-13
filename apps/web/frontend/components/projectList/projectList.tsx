import { useRouter } from 'next/router'
import { DiScrum } from 'react-icons/di'

import { FragmentType, graphql, useFragment } from '../../generated/gql'

export const ProjectListItemFragment = graphql(`
  fragment ProjectListItem on Project {
    id
    title
    startDate
    endDate
  }
`)

export interface ProjectListProps {
  projects: FragmentType<typeof ProjectListItemFragment>[]
  className?: string
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects: projectsFragment, className }) => {
  const router = useRouter()
  const projects = useFragment(ProjectListItemFragment, projectsFragment)
  const handleProjectSelect = (projectId: string) => router.push(`/projects/${projectId}`)

  return (
    <section className={`${className} flex flex-row flex-wrap gap-6`}>
      {projects.map((project) => (
        <article
          key={project.id}
          className="rounded-lg border-2 py-2 px-4 hover:cursor-pointer"
          onClick={() => handleProjectSelect(project.id)}
        >
          <h2 className="flex items-center">
            <DiScrum size="1.6em" />
            <span className="font-semibold">{project.title}</span>
          </h2>
          <p>{`${project.startDate ?? 'past'} until ${project.endDate ?? 'future'}`}</p>
        </article>
      ))}
    </section>
  )
}
