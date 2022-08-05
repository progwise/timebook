import { addDays, differenceInDays, eachDayOfInterval, format, formatISO, parseISO } from 'date-fns'
import { useRouter } from 'next/router'
import { DayWeekSwitch } from '../../../frontend/components/dayWeekSwitchButton'
import { FormattedDuration } from '../../../frontend/components/duration/formattedDuration'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableHeadRow,
  TableRow,
} from '../../../frontend/components/table/table'
import { ProjectFragment, TaskFragment, useWorkHoursQuery } from '../../../frontend/generated/graphql'

const NUMBER_OF_DAYS = 14

interface WorkHoursTableRow {
  task: TaskFragment
  project: ProjectFragment
  durations: number[]
}
const WeekPage = () => {
  const fromDate = new Date(2022, 5, 25)
  const toDate = addDays(fromDate, NUMBER_OF_DAYS - 1)
  const interval = { start: fromDate, end: toDate }
  const router = useRouter()
  const [{ data }] = useWorkHoursQuery({
    variables: {
      teamSlug: router.query.teamSlug?.toString() ?? '',
      from: formatISO(fromDate, { representation: 'date' }),
      to: formatISO(toDate, { representation: 'date' }),
    },
  })
  const tableData: WorkHoursTableRow[] = []
  for (const workHour of data?.workHours ?? []) {
    const workHourDate = parseISO(workHour.date)
    const weekDay = differenceInDays(workHourDate, fromDate)
    const rowIndex = tableData.findIndex((row) => {
      return row.task.id === workHour.task.id
    })
    if (rowIndex === -1) {
      tableData.push({
        project: workHour.project,
        task: workHour.task,
        durations: eachDayOfInterval(interval).map(() => 0),
      })
      tableData[tableData.length - 1].durations[weekDay] = workHour.duration
    } else {
      tableData[rowIndex].durations[weekDay] += workHour.duration
    }
  }

  return (
    <div>
      <Table>
        <TableHead>
          <TableHeadRow>
            <TableHeadCell />
            {eachDayOfInterval(interval).map((day) => (
              <TableHeadCell key={day.toString()}>
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
                <TableCell key={day.toString()}>{row.durations[dayIndex]}</TableCell>
              ))}
              <TableCell>
                <FormattedDuration
                  title=""
                  minutes={row.durations.reduce((previousValue, currentValue) => previousValue + currentValue)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DayWeekSwitch selectedButton="week" />
    </div>
  )
}
export default WeekPage
