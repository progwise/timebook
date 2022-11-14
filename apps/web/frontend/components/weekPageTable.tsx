import { addDays, differenceInDays, eachDayOfInterval, format, formatISO, isToday, parseISO } from 'date-fns'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { BiPlus } from 'react-icons/bi'

import {
  Button,
  FormattedDuration,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableHeadRow,
  TableRow,
} from '@progwise/timebook-ui'

import { ProjectFragment, TaskFragment, useWorkHoursQuery } from '../generated/graphql'
import { AddTaskRowModal } from './addTaskRow'
import { BookWorkHourModal, WorkHourItem } from './bookWorkHourModal'
import { DayWeekSwitch } from './dayWeekSwitchButton'
import { HourInput } from './hourInput'

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
  const [isAddtaskRowModalOpen, setIsAddTaskRowModalOpen] = useState(false)
  const router = useRouter()
  const fromDate = props.startDate
  const toDate = addDays(fromDate, NUMBER_OF_DAYS - 1)
  const interval = { start: fromDate, end: toDate }
  const context = useMemo(() => ({ additionalTypenames: ['WorkHour'] }), [])
  //eslint-disable-next-line unicorn/no-useless-undefined
  const [workHourItem, setWorkHourItem] = useState<WorkHourItem | undefined>(undefined)
  const [{ data }] = useWorkHoursQuery({
    variables: {
      teamSlug: router.query.teamSlug?.toString() ?? '',
      from: formatISO(fromDate, { representation: 'date' }),
      to: formatISO(toDate, { representation: 'date' }),
    },
    context,
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
                    onBlur={(duration: number) =>
                      setWorkHourItem({
                        date: day,
                        duration: duration,
                        projectId: row.project.id,
                        taskId: row.task.id,
                      })
                    }
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
      <Button ariaLabel="add row" variant="primary" onClick={() => setIsAddTaskRowModalOpen(true)}>
        <BiPlus className="text-3xl" />
      </Button>
      <DayWeekSwitch selectedButton="week" />
      {isAddtaskRowModalOpen && (
        <AddTaskRowModal
          workHourItem={{
            date: fromDate,
            taskId: '',
            projectId: '',
          }}
          onClose={() => setIsAddTaskRowModalOpen(false)}
        />
      )}
      {
        //eslint-disable-next-line unicorn/no-useless-undefined
        workHourItem && <BookWorkHourModal workHourItem={workHourItem} onClose={() => setWorkHourItem(undefined)} />
      }
    </div>
  )
}
