import { useRouter } from 'next/router'
import { ProjectFragment } from '../generated/graphql'
import { Button } from './button/button'

interface ProjectTableProps {
  projects: Array<ProjectFragment>
}

export const ProjectTable = (props: ProjectTableProps): JSX.Element => {
  const router = useRouter()

  const handleProjectDetails = async (project: ProjectFragment) => {
    await router.push(`/${router.query.teamSlug}/projects/${project.id}`)
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
            <tr key={project.id} className="hover:bg-gray-100 border-b-2">
              <td className="p-2">{project.title}</td>
              <td className="p-2">
                {project.startDate} - {project.endDate}
              </td>
              <td className="flex justify-end flex-wrap p-2">
                <Button variant="primary" onClick={() => handleProjectDetails(project)}>
                  Details
                </Button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
