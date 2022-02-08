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
    <Table className="w-full bg-white shadow-lg">
      <TableHead>
        <TableHeadRow>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Duration</TableHeadCell>
          <TableHeadCell />
        </TableHeadRow>
      </TableHead>
      <TableBody>
        {props.projects.map((project) => {
          return (
            <TableRow key={project.id}>
              <TableCell>{project.title}</TableCell>
              <TableCell>
                {project.startDate} - {project.endDate}
              </TableCell>
              <TableCell>
                <Button ariaLabel="Details" variant="primary" onClick={() => handleProjectDetails(project)}>
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
