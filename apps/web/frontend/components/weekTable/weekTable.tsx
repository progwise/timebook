import { Table, TableBody, TableFoot, TableHead } from '@progwise/timebook-ui'

import { ProjectWithWorkHoursFragment } from '../../generated/graphql'
import { WeekTableDateHeaderRow } from './weekTableDateHeaderRow'
import { WeekTableFooterRow } from './weekTableFooterRow'
import { WeekTableProjectRowGroup } from './weekTableProjectRowGroup'

export interface WeekTableProps {
  tableData: ProjectWithWorkHoursFragment[]
  startDate: Date
  endDate: Date
}

export const WeekTable: React.FC<WeekTableProps> = ({ tableData, startDate, endDate }) => {
  const interval = { start: startDate, end: endDate }
  const allWorkHours = tableData.flatMap((project) => project.tasks.flatMap((task) => task.workHours))

  return (
    <Table>
      <TableHead>
        <WeekTableDateHeaderRow interval={interval} />
      </TableHead>
      <TableBody>
        {tableData.map((project) => (
          <WeekTableProjectRowGroup interval={interval} project={project} key={project.id} />
        ))}
      </TableBody>
      <TableFoot>
        <WeekTableFooterRow interval={interval} workHours={allWorkHours} />
      </TableFoot>
    </Table>
  )
}
