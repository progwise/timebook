import { differenceInDays, isWithinInterval } from 'date-fns'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { WeekGridDateHeaderRow } from './weekGridDateHeaderRow'
import { WeekGridFooterRow } from './weekGridFooterRow'
import { WeekGridProjectRowGroup } from './weekGridProjectRowGroup'

export const WeekGridProjectFragment = graphql(`
  fragment WeekGridProject on Project {
    id
    tasks {
      workHours(from: $from, to: $to) {
        duration
        ...WeekGridFooter
      }
    }
    ...WeekGridProjectRowGroup
  }
`)

export interface WeekGridProps {
  tableData: FragmentType<typeof WeekGridProjectFragment>[]
  startDate: Date
  endDate: Date
}

export const WeekGrid: React.FC<WeekGridProps> = ({ tableData, startDate, endDate }) => {
  const projects = useFragment(WeekGridProjectFragment, tableData)
  const interval = { start: startDate, end: endDate }
  const numberOfDays = differenceInDays(endDate, startDate) + 1
  const allWorkHours = projects.flatMap((project) => project.tasks.flatMap((task) => task.workHours))
  const allTasks = projects.flatMap((project) => project.tasks)
  const numberOfRows = 1 + projects.length + allTasks.length + 1
  return (
    <div
      role="table"
      className="relative grid items-center [&_div]:border-gray-400"
      style={{
        gridTemplateColumns: `min-content minmax(min-content, 1fr) repeat(${numberOfDays + 2}, min-content)`,
        gridTemplateRows: `repeat(${numberOfRows}, min-content)`,
      }}
    >
      {/* adds a border around week day headers and all hour inputs */}
      <div className="pointer-events-none absolute col-start-3 col-end-[-3] row-start-1 flex h-full w-full self-stretch rounded-md border" />

      {/* adds a border around project row groups and task rows */}
      <div className="pointer-events-none absolute col-start-1 col-end-[-1] row-start-2 row-end-[-2] flex h-full w-full self-stretch rounded-md border" />

      {/* adds a highlight for a current day of the week */}
      {isWithinInterval(new Date(), interval) && (
        <div
          className="absolute col-span-1 row-start-1 flex h-full w-full self-stretch p-1"
          style={{ gridColumnStart: differenceInDays(new Date(), startDate) + 3 }}
        >
          <div className="h-full w-full rounded-md bg-slate-200 dark:bg-gray-900" />
        </div>
      )}

      <WeekGridDateHeaderRow interval={interval} />
      {projects.map((project, index) => (
        <WeekGridProjectRowGroup
          interval={interval}
          project={project}
          key={project.id}
          isFirstProject={index === 0}
          isLastProject={index === projects.length - 1}
        />
      ))}
      <WeekGridFooterRow interval={interval} workHours={allWorkHours} />
    </div>
  )
}
