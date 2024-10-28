import { endOfMonth, format, formatISO, getMonth, getYear, startOfMonth } from 'date-fns'
import { useRouter } from 'next/router'
import groupby from 'object.groupby'
import { Fragment, useMemo, useState } from 'react'
import { FaFolderMinus, FaFolderOpen, FaPrint } from 'react-icons/fa6'
import { useQuery } from 'urql'

import { FormattedDuration, ListboxWithUnselect } from '@progwise/timebook-ui'

import { graphql, useFragment } from '../../generated/gql'
import { ProjectFilter } from '../../generated/gql/graphql'
import { PageHeading } from '../pageHeading'
import { CalendarMonthSelector } from './calendarMonthSelector'
import { ProjectLockButton } from './projectLockButton'
import { ReportUserSelect } from './reportUserSelect'

export const ReportProjectFragment = graphql(`
  fragment ReportProject on Project {
    id
    title
    canModify
    isArchived
    isLocked(date: $date)
  }
`)

const ReportProjectsQueryDocument = graphql(`
  query reportProjects($from: Date!, $to: Date, $filter: ProjectFilter, $date: MonthInput!) {
    projects(from: $from, to: $to, filter: $filter) {
      ...ReportProject
    }
  }
`)

const ReportQueryDocument = graphql(`
  query report(
    $projectId: ID!
    $month: Int!
    $year: Int!
    $userId: ID
    $groupByUser: Boolean!
    $from: Date!
    $to: Date!
  ) {
    project(projectId: $projectId) {
      canModify
    }
    report(projectId: $projectId, month: $month, year: $year, userId: $userId) {
      groupedByDate {
        date
        duration
        workHours {
          id
          duration
          user {
            id
            name
          }
          task {
            id
            title
            workHourOfDays(from: $from, to: $to) {
              date
              workHour {
                comment
              }
              isLocked
            }
          }
        }
      }
      groupedByTask {
        task {
          id
          title
        }
        duration
      }
      groupedByUser @include(if: $groupByUser) {
        user {
          id
          name
        }
        duration
      }
    }
  }
`)
interface ReportFormProps {
  date: Date
  projectId?: string
  userId?: string
}

export const ReportForm = ({ date, projectId, userId }: ReportFormProps) => {
  const router = useRouter()
  const year = getYear(date)
  const month = getMonth(date)
  const from = startOfMonth(date)
  const to = endOfMonth(date)
  const fromString = formatISO(from, { representation: 'date' })
  const toString = formatISO(to, { representation: 'date' })

  const [{ data: projectsData }] = useQuery({
    query: ReportProjectsQueryDocument,
    variables: { from: fromString, to: toString, filter: ProjectFilter.ActiveOrArchived, date: { year, month } },
  })
  const projects = useFragment(ReportProjectFragment, projectsData?.projects)

  const context = useMemo(() => ({ additionalTypenames: ['WorkHour'] }), [])
  const [{ data: reportGroupedData }] = useQuery({
    query: ReportQueryDocument,
    variables: {
      projectId: projectId ?? '',
      year,
      month,
      userId: userId,
      groupByUser: !userId,
      from: fromString,
      to: toString,
    },
    context,
    pause: !router.isReady || !projectId,
  })

  const selectedProject = projects?.find((project) => project.id === projectId)

  const [groupedBy, setGroupedBy] = useState<'Grouped by User' | 'Grouped by Task' | undefined>()

  const sortedProjects = useMemo(
    () =>
      projects
        ?.toSorted((projectA, projectB) => projectA.title.localeCompare(projectB.title))
        .toSorted((projectA, projectB) => Number(projectA.isArchived) - Number(projectB.isArchived)) ?? [],
    [projects],
  )

  return (
    <>
      <div className="mb-2 border-b border-base-content">
        <div className="flex items-center justify-between">
          <PageHeading>
            Detailed time report: {fromString} — {toString}
          </PageHeading>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CalendarMonthSelector
            selectLabel
            date={date}
            onDateChange={(newDate) => {
              if (newDate) {
                router.push({
                  pathname: `/reports/${format(newDate, 'yyyy-MM')}/${projectId ?? ''}`,
                  query: userId ? { userId } : undefined,
                })
              }
            }}
          />
          <ListboxWithUnselect
            value={selectedProject}
            getLabel={(project) =>
              project.isArchived ? (
                <>
                  <FaFolderMinus className="inline" /> {project.title}
                </>
              ) : (
                <>
                  <FaFolderOpen className="inline" /> {project.title}
                </>
              )
            }
            getKey={(project) => project.id}
            onChange={(newProject) =>
              router.push({
                pathname: `/reports/${format(date, 'yyyy-MM')}/${newProject?.id ?? ''}`,
                query: userId ? { userId } : undefined,
              })
            }
            options={sortedProjects}
            noOptionLabel="Select Project"
          />
        </div>

        <div>
          {projectId && reportGroupedData && (
            <button className="btn btn-primary btn-lg print:hidden" onClick={() => print()}>
              <FaPrint />
              Print
            </button>
          )}
        </div>
      </div>

      <div className="mb-4 flex items-end justify-between gap-2">
        <div className="stats shadow">
          {projectId && reportGroupedData && (
            <div className="stat">
              <div className="stat-title">Total hours</div>
              <div className="stat-value">
                <FormattedDuration
                  title="Total work hours of the selected project"
                  minutes={reportGroupedData?.report.groupedByDate
                    .map((WorkHourDuration) => WorkHourDuration.duration)
                    .reduce((sum, duration) => duration + sum, 0)}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-x-2">
          {selectedProject && <ProjectLockButton year={year} month={month} project={selectedProject} />}
          {projectId && (
            <>
              <ReportUserSelect
                projectId={projectId}
                selectedUserId={userId}
                onUserChange={(newUserId) =>
                  router.push({
                    pathname: `/reports/${format(date, 'yyyy-MM')}/${projectId ?? ''}`,
                    query: newUserId ? { userId: newUserId } : undefined,
                  })
                }
                from={from}
                to={to}
              />
              <ListboxWithUnselect
                value={groupedBy}
                options={['Grouped by User', 'Grouped by Task'] as const}
                getKey={(value) => value}
                getLabel={(value) => value}
                noOptionLabel="All Details"
                onChange={(newGroupedBy) => {
                  setGroupedBy(newGroupedBy)
                }}
              />
            </>
          )}
        </div>
      </div>

      {projectId && reportGroupedData && (
        <>
          <div>
            <table className="table text-base">
              <thead className="bg-base-200 text-base text-base-content">
                <tr>
                  <th>Tasks</th>
                  <th>Person</th>
                  <th>Comments</th>
                  <th className="w-px text-right">Hours</th>
                </tr>
              </thead>
              <tbody>
                {reportGroupedData?.report.groupedByDate.map((group) => (
                  <Fragment key={group.date}>
                    <tr className="font-bold">
                      <td>{group.date}</td>
                      <td />
                      <td />
                      <td className="text-right">
                        <FormattedDuration
                          title="Total work hours of the day"
                          minutes={group.workHours
                            .map((WorkHourDuration) => WorkHourDuration.duration)
                            .reduce((sum, duration) => duration + sum, 0)}
                        />
                      </td>
                    </tr>
                    {groupedBy === undefined &&
                      group.workHours.map((workHour) => (
                        <tr key={workHour.id}>
                          <td className="pl-8">{workHour.task.title}</td>
                          <td>{workHour.user?.name}</td>
                          <td>
                            {workHour.task.workHourOfDays
                              .filter((workHourOfDay) => workHourOfDay.date === group.date)
                              .map(
                                (workHourOfDay) =>
                                  workHourOfDay.workHour?.comment && (
                                    <div key={workHourOfDay.date}>{workHourOfDay.workHour.comment}</div>
                                  ),
                              )}
                          </td>
                          <td className="text-right">
                            <FormattedDuration title="Work duration" minutes={workHour.duration} />
                          </td>
                        </tr>
                      ))}
                    {groupedBy === 'Grouped by Task' &&
                      Object.entries(groupby(group.workHours, (workHour) => workHour.task.id)).map(
                        ([taskId, workHours]) => (
                          <tr key={taskId}>
                            <td className="pl-8">{workHours[0].task.title}</td>
                            <td>{workHours.map((user) => user.user.name).join(', ')}</td>
                            <td>
                              {workHours[0].task.workHourOfDays
                                .filter((workHourOfDay) => workHourOfDay.date === group.date)
                                .map(
                                  (workHourOfDay) =>
                                    workHourOfDay.workHour?.comment && (
                                      <div key={workHourOfDay.date}>{workHourOfDay.workHour.comment}</div>
                                    ),
                                )}
                            </td>
                            <td className="text-right">
                              <FormattedDuration
                                title="Combined hours of all users"
                                minutes={workHours
                                  .map((WorkHourDuration) => WorkHourDuration.duration)
                                  .reduce((sum, duration) => duration + sum, 0)}
                              />
                            </td>
                          </tr>
                        ),
                      )}
                    {groupedBy === 'Grouped by User' &&
                      Object.entries(groupby(group.workHours, (workHour) => workHour.user.id)).map(
                        ([userId, workHours]) => (
                          <tr key={userId}>
                            <td className="pl-8">{workHours.map((task) => task.task.title).join(', ')}</td>
                            <td>{workHours[0].user.name}</td>
                            <td>
                              {workHours.map((workHour) => (
                                <div key={workHour.id}>
                                  {workHour.task.workHourOfDays
                                    .filter((workHourOfDay) => workHourOfDay.date === group.date)
                                    .map(
                                      (workHourOfDay) =>
                                        workHourOfDay.workHour?.comment && (
                                          <div key={workHourOfDay.date}>{workHourOfDay.workHour.comment}</div>
                                        ),
                                    )}
                                </div>
                              ))}
                            </td>
                            <td className="text-right">
                              <FormattedDuration
                                title="Combined hours for all tasks"
                                minutes={workHours
                                  .map((WorkHourDuration) => WorkHourDuration.duration)
                                  .reduce((sum, duration) => duration + sum, 0)}
                              />
                            </td>
                          </tr>
                        ),
                      )}
                  </Fragment>
                ))}
              </tbody>
            </table>
            <div className="divider" />
            <table className="table mt-8 text-base">
              <thead className="bg-base-200 text-base text-base-content">
                <tr className="bg-base-200 font-bold">
                  <th>Total by Task</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {reportGroupedData?.report.groupedByTask.map((entry) => (
                  <tr key={entry.task.id}>
                    <td>{entry.task.title}</td>
                    <td className="text-right">
                      <FormattedDuration title="Total by task" minutes={entry.duration} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="divider" />
            <table className="table mt-8 text-base">
              {reportGroupedData?.report.groupedByUser && (
                <>
                  <thead className="bg-base-200 text-base text-base-content">
                    <tr className="font-bold">
                      <th>Total by Person</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {reportGroupedData.report.groupedByUser.map((group) => (
                      <tr key={group.user.id}>
                        <td>{group.user.name}</td>
                        <td className="text-right">
                          <FormattedDuration title="Total by user" minutes={group.duration} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
          </div>
          <div className="divider" />
          <div className="pr-4 text-right text-lg font-bold">
            Total{' '}
            <FormattedDuration
              title="Total work hours of the selected project"
              minutes={reportGroupedData?.report.groupedByDate
                .map((WorkHourDuration) => WorkHourDuration.duration)
                .reduce((sum, duration) => duration + sum, 0)}
            />
          </div>
        </>
      )}
    </>
  )
}
