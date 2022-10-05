import { ProjectFragment } from '../../generated/graphql'
import { DiScrum } from 'react-icons/di'
import { useRouter } from 'next/router'
export interface ProjectListProps {
  projects: Array<ProjectFragment>
  className?: string
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, className }) => {
  const router = useRouter()
  const handleProjectSelect = (project: ProjectFragment) =>
    router.push(`/${router.query.teamSlug}/projects/${project.id}`)

  return (
    <section className={`${className} flex flex-row flex-wrap gap-6`}>
      {projects.map((project) => (
        <article
          key={project.id}
          className="rounded-lg border-2 py-2 px-4 hover:cursor-pointer"
          onClick={() => handleProjectSelect(project)}
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
