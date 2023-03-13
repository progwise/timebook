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
    <Table className="w-full bg-white shadow-lg dark:bg-slate-800">
      <TableHead>
        <TableHeadRow>
          <TableHeadCell>Name</TableHeadCell>
          <TableHeadCell>Duration</TableHeadCell>
          <TableHeadCell />
        </TableHeadRow>
      </TableHead>
      <TableBody>
        {projects.map((project) => {
          return (
            <TableRow key={project.id}>
              <TableCell>{project.title}</TableCell>
              <TableCell>
                {project.startDate} - {project.endDate}
              </TableCell>
              <TableCell>
                <Button variant="tertiary" onClick={() => handleProjectDetails(project.id)}>
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
