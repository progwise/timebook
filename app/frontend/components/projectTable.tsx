import { useRouter } from 'next/router'
import { ProjectFragment, useProjectDeleteMutation } from '../generated/graphql'
import { MouseEvent } from 'react'

interface ProjectTableProps {
  projects: Array<ProjectFragment>
}

export const ProjectTable = (props: ProjectTableProps): JSX.Element => {
  const [, projectDelete] = useProjectDeleteMutation()
  const router = useRouter()

  const handleDeleteProject = async (event: MouseEvent, project: ProjectFragment) => {
    event.stopPropagation()
    await projectDelete({ id: project.id })
  }

  const handleProjectDetails = async (project: ProjectFragment) => {
    await router.push(`/projects/${project.id}`)
  }

  return (
    <table className="shadow-lg bg-white w-full">
      <thead>
        <tr>
          <th className="bg-gray-100 border-b text-left px-2 pb-2 pt-2 text-gray-600">Name</th>
          <th className="bg-gray-100 border-b text-left px-2 pb-2 pt-2 text-gray-600">Duration</th>
          <th className="bg-gray-100 border-b text-left px-2 pb-2 pt-2 text-gray-600" />
        </tr>
      </thead>
      <tbody>
        {props.projects.map((project) => {
          return (
            <tr key={project.id} className="hover:bg-gray-100">
              <td className="py-2 border-b-2 px-2">{project.title} </td>
              <td className="py-2 border-b-2 px-2">
                {project.startDate} - {project.endDate}
              </td>
              <td className="flex justify-end flex-wrap gap-x-3 py-2 border-b-2 px-2">
                <button className="btn btn-gray2" onClick={(event) => handleDeleteProject(event, project)}>
                  Delete
                </button>
                <button className="btn btn-gray2" onClick={() => handleProjectDetails(project)}>
                  Details
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
