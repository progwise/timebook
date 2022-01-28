import { useRouter } from 'next/router'
import { ProjectFragment } from '../generated/graphql'
import { Button } from './button/button'
import { Table, TableHead, TableRow, TableHeadCell, TableBody, TableCell, TableHeadRow } from './table/table'

interface ProjectTableProps {
  projects: Array<ProjectFragment>
}

export const ProjectTable = (props: ProjectTableProps): JSX.Element => {
  const router = useRouter()

  const handleProjectDetails = async (project: ProjectFragment) => {
    await router.push(`/${router.query.teamSlug}/projects/${project.id}`)
  }

  return (
    <Table className="shadow-lg bg-white w-full">
      <TableHead>
        <TableHeadRow>
          <TableHeadCell className="bg-gray-100 border-b text-left px-2 pb-2 pt-2 text-gray-600">Name</TableHeadCell>
          <TableHeadCell className="bg-gray-100 border-b text-left px-2 pb-2 pt-2 text-gray-600">
            Duration
          </TableHeadCell>
          <TableHeadCell className="bg-gray-100 border-b text-left px-2 pb-2 pt-2 text-gray-600" />
        </TableHeadRow>
      </TableHead>
      <TableBody>
        {props.projects.map((project) => {
          return (
            <TableRow key={project.id} className="hover:bg-gray-100 border-b-2">
              <TableCell className="p-2">{project.title}</TableCell>
              <TableCell className="p-2">
                {project.startDate} - {project.endDate}
              </TableCell>
              <TableCell className="flex justify-end flex-wrap p-2">
                <Button variant="primary" onClick={() => handleProjectDetails(project)}>
                  Details
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
