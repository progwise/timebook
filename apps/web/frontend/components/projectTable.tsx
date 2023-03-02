import { useRouter } from 'next/router'

import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableHeadCell,
  TableBody,
  TableCell,
  TableHeadRow,
} from '@progwise/timebook-ui'

import { ProjectFragment } from '../generated/graphql'

interface ProjectTableProps {
  projects: Array<ProjectFragment>
}

export const ProjectTable = (props: ProjectTableProps): JSX.Element => {
  const router = useRouter()

  const handleProjectDetails = async (project: ProjectFragment) => {
    await router.push(`/projects/${project.id}`)
  }

  return (
    <Table className="w-full bg-white shadow-lg dark:bg-slate-800">
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
                <Button variant="tertiary" onClick={() => handleProjectDetails(project)}>
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
