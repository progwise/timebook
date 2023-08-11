import { differenceInDays } from 'date-fns'

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
  const numberOfDays = differenceInDays(endDate, startDate)
  const allWorkHours = projects.flatMap((project) => project.tasks.flatMap((task) => task.workHours))

  return (
    <div
      className="relative grid grid-cols-11 items-center [&_div]:border-gray-400"
      style={{
        gridTemplateColumns: `min-content minmax(min-content, 1fr) repeat(${numberOfDays + 3}, min-content)`,
        gridTemplateRows: `repeat(99999, min-content)`,
      }}
    >
      <div className="pointer-events-none absolute col-start-3 col-end-[-3] row-start-1 flex h-full w-full self-stretch rounded-md border" />
      <div className="pointer-events-none absolute col-start-1 col-end-[-1] row-start-2 row-end-[-2] flex h-full w-full self-stretch rounded-md border" />
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
