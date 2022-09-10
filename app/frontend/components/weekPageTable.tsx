import { addDays, differenceInDays, eachDayOfInterval, format, formatISO, isToday, parseISO } from 'date-fns'
import { useRouter } from 'next/router'
import { DayWeekSwitch } from './dayWeekSwitchButton'
import { FormattedDuration } from './duration/formattedDuration'
import { HourInput } from './hourInput'
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableHeadRow, TableRow } from './table/table'
import { ProjectFragment, TaskFragment, useWorkHoursQuery } from '../generated/graphql'

const NUMBER_OF_DAYS = 7

interface WeekPageTableProps {
  startDate: Date
}
interface WorkHoursTableRow {
  task: TaskFragment
  project: ProjectFragment
  durations: number[]
}
export const WeekPageTable = (props: WeekPageTableProps) => {
  const fromDate = new Date(2022, 7, 8)
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

  const classNameMarkDay = 'bg-slate-300 dark:bg-gray-900'

  return (
    <>
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
                    <HourInput readOnly onChange={console.log} workHours={row.durations[dayIndex] / 60} />
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
        <DayWeekSwitch selectedButton="week" />
      </div>
    </>
  )
}
