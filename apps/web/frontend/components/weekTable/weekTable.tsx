import { Table, TableBody, TableFoot, TableHead } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { WeekTableDateHeaderRow } from './weekTableDateHeaderRow'
import { WeekTableFooterRow } from './weekTableFooterRow'
import { WeekTableProjectRowGroup } from './weekTableProjectRowGroup'

export const WeekTableProjectFragment = graphql(`
  fragment WeekTableProject on Project {
    id
    tasks {
      workHours(from: $from, to: $to) {
        duration
        ...WeekTableFooter
      }
    }
    ...WeekTableProjectRowGroup
  }
`)

export interface WeekTableProps {
  tableData: FragmentType<typeof WeekTableProjectFragment>[]
  startDate: Date
  endDate: Date
}

export const WeekTable: React.FC<WeekTableProps> = ({ tableData, startDate, endDate }) => {
  const projects = useFragment(WeekTableProjectFragment, tableData)
  const interval = { start: startDate, end: endDate }
  const allWorkHours = projects.flatMap((project) => project.tasks.flatMap((task) => task.workHours))

  return (
    <Table>
      <TableHead>
        <WeekTableDateHeaderRow interval={interval} />
      </TableHead>
      <TableBody>
        {projects.map((project) => (
          <WeekTableProjectRowGroup interval={interval} project={project} key={project.id} />
        ))}
      </TableBody>
      <TableFoot>
        <WeekTableFooterRow interval={interval} workHours={allWorkHours} />
      </TableFoot>
    </Table>
  )
}
