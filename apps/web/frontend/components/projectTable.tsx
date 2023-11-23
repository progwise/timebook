import { useRouter } from 'next/router'

import { FragmentType, graphql, useFragment } from '../generated/gql'

export const ProjectTableItemFragment = graphql(`
  fragment ProjectTableItem on Project {
    id
    title
    startDate
    endDate
  }
`)

interface ProjectTableProps {
  projects: FragmentType<typeof ProjectTableItemFragment>[]
}

export const ProjectTable = (props: ProjectTableProps): JSX.Element => {
  const router = useRouter()
  const projects = useFragment(ProjectTableItemFragment, props.projects)

  const handleProjectDetails = async (projectId: string) => {
    await router.push(`/projects/${projectId}`)
  }

  return (
    <div className="rounded-box w-full border shadow-lg">
      <table className="table">
        <thead className="text-xl text-base-content">
          <tr>
            <th>Name</th>
            <th>Duration</th>
            <th />
          </tr>
        </thead>
        <tbody className="text-base">
          {projects.map((project) => {
            return (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td>
                  {project.startDate} - {project.endDate}
                </td>
                <td className="text-right">
                  <button className="btn btn-outline btn-sm" onClick={() => handleProjectDetails(project.id)}>
                    Details
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
