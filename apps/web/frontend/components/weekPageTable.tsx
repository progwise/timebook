import { addDays, eachDayOfInterval, format, isToday } from 'date-fns'

import {
  FormattedDuration,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableHeadRow,
  TableRow,
} from '@progwise/timebook-ui'

import { ProjectFragment, TaskFragment, useWorkHourUpdateMutation } from '../generated/graphql'
import { HourInput } from './hourInput'

export interface WeekPageTableProps {
  startDate: Date
  tableData: WorkHoursTableRow[]
  numberOfDays: number
}
export interface WorkHoursTableRow {
  task: TaskFragment
  project: ProjectFragment
  durations: number[]
}
export const WeekPageTable: React.FC<WeekPageTableProps> = ({ startDate, tableData, numberOfDays = 7 }) => {
  const fromDate = startDate
  const toDate = addDays(fromDate, numberOfDays - 1)
  const interval = { start: fromDate, end: toDate }
  const [, workHourUpdate] = useWorkHourUpdateMutation()

  const classNameMarkDay = 'bg-slate-300 dark:bg-gray-900'

  return (
    <div>
      <Table>
        <TableHead>
          <TableHeadRow>
            <TableHeadCell />
            {eachDayOfInterval(interval).map((day) => (
              <TableHeadCell className={isToday(day) ? classNameMarkDay : ''} key={day.toString()}>
                {format(day, 'EEE')}
                <br />
                {format(day, 'dd. MMM')}
              </TableHeadCell>
            ))}
            <TableHeadCell />
          </TableHeadRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <TableRow key={row.task.id}>
              <TableCell>
                {row.project.title}
                <br />
                {row.task.title}
              </TableCell>
              {eachDayOfInterval(interval).map((day, dayIndex) => (
                <TableCell className={isToday(day) ? classNameMarkDay : ''} key={day.toString()}>
                  {/* eslint-disable-next-line @typescript-eslint/no-empty-function */}
                  <HourInput
                    onBlur={(duration: number) => {
                      workHourUpdate({
                        data: {
                          date: format(day, 'yyyy-MM-dd'),
                          duration: duration,
                          taskId: row.task.id,
                        },
                        date: format(day, 'yyyy-MM-dd'),
                        taskId: row.task.id,
                      })
                    }}
                    workHours={row.durations[dayIndex] / 60}
                  />
                </TableCell>
              ))}
              <TableCell>
                <FormattedDuration
                  title=""
                  minutes={row.durations.reduce((previousValue, currentValue) => previousValue + currentValue)}
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell />
            {eachDayOfInterval(interval).map((day, dayIndex) => (
              <TableCell className={isToday(day) ? classNameMarkDay : ''} key={day.toString()}>
                <FormattedDuration
                  title=""
                  minutes={tableData
                    .map((row) => row.durations[dayIndex])
                    .reduce((previousValue, currentValue) => previousValue + currentValue, 0)}
                />
              </TableCell>
            ))}
            <TableCell>
              <FormattedDuration
                title=""
                minutes={tableData
                  .flatMap((row) => row.durations)
                  .reduce((previousValue, currentValue) => previousValue + currentValue, 0)}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
