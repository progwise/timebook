import { endOfMonth, format, formatISO, getMonth, getYear, startOfMonth } from 'date-fns'
import { useRouter } from 'next/router'
import { Fragment, useMemo } from 'react'
import { BiPrinter } from 'react-icons/bi'
import { useQuery } from 'urql'

import { FormattedDuration, ListboxWithUnselect } from '@progwise/timebook-ui'

import { graphql, useFragment } from '../../generated/gql'
import { ProjectFilter } from '../../generated/gql/graphql'
import { PageHeading } from '../pageHeading'
import { ProjectLockButton } from './projectLockButton'
import { ReportUserSelect } from './reportUserSelect'

export const ReportProjectFragment = graphql(`
  fragment ReportProject on Project {
    id
    title
    role
    canModify
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
  query report($projectId: ID!, $month: Int!, $year: Int!, $userId: ID, $groupByUser: Boolean!) {
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
            name
          }
          task {
            title
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
  const endString = formatISO(to, { representation: 'date' })

  const [{ data: projectsData }] = useQuery({
    query: ReportProjectsQueryDocument,
    variables: { from: fromString, filter: ProjectFilter.All, date: { year, month } },
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
    },
    context,
    pause: !router.isReady || !projectId,
  })

  const selectedProject = projects?.find((project) => project.id === projectId)
  const userIsAdmin = selectedProject?.role === 'ADMIN'

  return (
    <>
      <div className="mb-2 border-b border-base-content">
        <div className="flex items-center justify-between">
          <PageHeading>
            Detailed time report: {fromString} — {endString}
          </PageHeading>
        </div>
      </div>
      {projectId && reportGroupedData && userIsAdmin && (
        <div className="stats shadow">
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
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="flex flex-row items-center gap-2">
            <ListboxWithUnselect
              value={selectedProject}
              getLabel={(project) => project.title}
              getKey={(project) => project.id}
              onChange={(newProject) =>
                router.push({
                  pathname: `/reports/${format(date, 'yyyy-MM')}/${newProject?.id ?? ''}`,
                  query: userId ? { userId } : undefined,
                })
              }
              options={projects ?? []}
              noOptionLabel="Select Project"
            />
            <input
              className="btn"
              type="month"
              value={format(date, 'yyyy-MM')}
              onChange={(event) => {
                if (event.target.value) {
                  router.push({
                    pathname: `/reports/${event.target.value}/${projectId ?? ''}`,
                    query: userId ? { userId } : undefined,
                  })
                }
              }}
            />
          </div>
          <div className="flex items-center gap-2">
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
                <button className="btn btn-md print:hidden" onClick={() => print()}>
                  <BiPrinter />
                </button>
              </>
            )}
          </div>
        </div>

        {projectId && reportGroupedData && userIsAdmin && (
          <>
            <div>
              <table className="table text-base">
                <thead className="bg-base-200 text-base text-base-content">
                  <tr>
                    <th>Tasks</th>
                    <th>Person</th>
                    <th className="w-px text-right">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {reportGroupedData?.report.groupedByDate.map((group) => (
                    <Fragment key={group.date}>
                      <tr className="font-bold">
                        <td>{group.date}</td>
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
                      {group.workHours.map((workHour) => (
                        <tr key={workHour.id}>
                          <td className="pl-8">{workHour.task.title}</td>
                          <td>{workHour.user?.name}</td>
                          <td className="text-right">
                            <FormattedDuration title="Work duration" minutes={workHour.duration} />
                          </td>
                        </tr>
                      ))}
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
      </div>
    </>
  )
}
