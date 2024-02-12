import { differenceInDays, isWithinInterval } from 'date-fns'
import Link from 'next/link'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { WeekGridDateHeaderRow } from './weekGridDateHeaderRow'
import { WeekGridFooterRow } from './weekGridFooterRow'
import { WeekGridProjectRowGroup } from './weekGridProjectRowGroup'

export const WeekGridProjectFragment = graphql(`
  fragment WeekGridProject on Project {
    id
    tasks {
      workHourOfDays(from: $from, to: $to) {
        ...WeekGridFooter
        workHour {
          duration
        }
      }
    }
    ...WeekGridProjectRowGroup
  }
`)

export interface WeekGridProps {
  tableData: FragmentType<typeof WeekGridProjectFragment>[]
  startDate: Date
  endDate: Date
  isDataOutdated?: boolean
}

export const WeekGrid: React.FC<WeekGridProps> = ({ tableData, startDate, endDate, isDataOutdated = false }) => {
  const projects = useFragment(WeekGridProjectFragment, tableData)
  const interval = { start: startDate, end: endDate }
  const numberOfDays = differenceInDays(endDate, startDate) + 1
  const allWorkHours = projects.flatMap((project) => project.tasks.flatMap((task) => task.workHourOfDays))
  const allTasks = projects.flatMap((project) => project.tasks)
  const numberOfRows =
    projects.length === 0
      ? 3 // header row + one empty row + footer row
      : 1 + projects.length + allTasks.length + 1 // header row + project rows + task rows + footer row

  return (
    <div
      role="table"
      className="relative grid items-center [&_div]:border-base-content"
      style={{
        gridTemplateColumns: `min-content minmax(min-content, 1fr) repeat(${numberOfDays + 1}, min-content)`,
        gridTemplateRows: `repeat(${numberOfRows}, min-content)`,
      }}
    >
      {/* adds a border around week day headers, all hour inputs and week day footers */}
      <div className="pointer-events-none absolute z-30 col-start-3 col-end-[-2] h-full w-full rounded-box border opacity-50" />

      {/* adds a border around project row groups and task rows */}
      <div className="pointer-events-none absolute col-start-1 col-end-[-1] row-start-2 row-end-[-2] h-full w-full rounded-box border opacity-50" />

      {/* adds a background color to the header row and the footer row*/}
      <div className="absolute col-start-3 col-end-[-2] row-span-1 row-start-1 h-full w-full rounded-t-box bg-base-200" />
      <div className="absolute col-start-3 col-end-[-2] row-span-1 row-start-[-2] h-full w-full rounded-b-box bg-base-200" />

      {/* adds a highlight for a current day of the week */}
      {isWithinInterval(new Date(), interval) && (
        <div
          className="absolute z-10 col-span-1 h-full w-full rounded-box border bg-base-300 shadow-lg"
          style={{ gridColumnStart: differenceInDays(new Date(), startDate) + 3 }}
        />
      )}

      <WeekGridDateHeaderRow interval={interval} />
      {projects.map((project) => (
        <WeekGridProjectRowGroup
          interval={interval}
          project={project}
          key={project.id}
          isDataOutdated={isDataOutdated}
        />
      ))}
      {projects.length === 0 && (
        <div className="z-20 col-span-2 col-start-1 flex justify-center px-5 py-10 text-center">
          <p className="max-w-80 text-balance">
            There are no projects for this week, click{' '}
            <Link href="/projects/new" className="link link-primary">
              here
            </Link>{' '}
            to add a new project.
          </p>
        </div>
      )}
      <WeekGridFooterRow interval={interval} workHours={allWorkHours} isDataOutdated={isDataOutdated} />
    </div>
  )
}
