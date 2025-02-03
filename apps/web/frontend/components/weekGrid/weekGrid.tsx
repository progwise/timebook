import { differenceInDays, isWithinInterval } from 'date-fns'
import Link from 'next/link'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { isSessionUserAdminOfProject, getSessionUserId } from '../projectUtils'
import { WeekGridDateHeaderRow } from './weekGridDateHeaderRow'
import { WeekGridFooterRow } from './weekGridFooterRow'
import { WeekGridProjectRowGroup } from './weekGridProjectRowGroup'

export const WeekGridProjectFragment = graphql(`
  fragment WeekGridProject on Project {
    id
    tasks {
      footerTotal: workHourOfDays(from: $from, to: $to, userIds: $userIds) {
        ...WeekGridFooter
        user {
          id
        }
        workHour {
          duration
        }
      }
      project {
        canModify
        members {
          id
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
  userIds: string[]
}

export const WeekGrid: React.FC<WeekGridProps> = ({
  tableData,
  startDate,
  endDate,
  isDataOutdated = false,
  userIds,
}) => {
  const projects = useFragment(WeekGridProjectFragment, tableData)
  const interval = { start: startDate, end: endDate }
  const numberOfDays = differenceInDays(endDate, startDate) + 1
  const sessionUserId = getSessionUserId()
  const allWorkHours = sessionUserId
    ? projects.flatMap((project) =>
        project.tasks.flatMap((task) =>
          task.footerTotal.filter((workHour) => {
            const isAdmin = sessionUserId && isSessionUserAdminOfProject(task.project, sessionUserId)
            return (
              (isAdmin || workHour.user.id === sessionUserId) &&
              task.project.members.some((member) => member.id === workHour.user.id)
            )
          }),
        ),
      )
    : []
  const allTasks = projects.flatMap((project) => project.tasks)
  const numberOfRows =
    projects.length === 0
      ? 3 // header row + one empty row + footer row
      : 1 +
        projects.length +
        // eslint-disable-next-line unicorn/no-array-reduce
        allTasks.reduce((accumulator, task) => {
          const isAdmin = sessionUserId && isSessionUserAdminOfProject(task.project, sessionUserId)
          const projectMembers = isAdmin
            ? task.project.members.filter((member) => userIds.includes(member.id))
            : task.project.members.filter((member) => member.id === sessionUserId)
          return accumulator + (userIds.length > 1 ? projectMembers.length : 1)
        }, 0) +
        1 // header row + project rows + task rows + footer row

  return (
    <div
      role="table"
      className="relative grid items-center [&_div]:border-base-content"
      style={{
        gridTemplateColumns: `min-content minmax(min-content, 1fr) repeat(${numberOfDays + 2}, min-content)`,
        gridTemplateRows: `repeat(${numberOfRows}, min-content)`,
      }}
    >
      {/* adds a border around week day headers, all hour inputs and week day footers */}
      <div className="pointer-events-none absolute z-30 col-start-3 col-end-[-3] size-full rounded-box border opacity-50" />

      {/* adds a border around project row groups and task rows */}
      <div className="pointer-events-none absolute col-start-1 col-end-[-1] row-start-2 row-end-[-2] size-full rounded-box border opacity-50" />

      {/* adds a background color to the header row and the footer row*/}
      <div className="absolute col-start-3 col-end-[-3] row-span-1 row-start-1 size-full rounded-t-box bg-base-200" />
      <div className="absolute col-start-3 col-end-[-3] row-span-1 row-start-[-2] size-full rounded-b-box bg-base-200" />

      {/* adds a highlight for a current day of the week */}
      {isWithinInterval(new Date(), interval) && (
        <div
          className="absolute z-10 col-span-1 size-full rounded-box border bg-base-300 shadow-lg"
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
          userIds={userIds}
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
