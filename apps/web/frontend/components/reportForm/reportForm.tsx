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
      <div className="mb-8 border-b">
        <div className="flex items-center justify-between">
          <PageHeading>
            Detailed time report: {fromString} — {endString}
          </PageHeading>
        </div>
      </div>
      {projectId && reportGroupedData && userIsAdmin && (
        <div className="flex-col">
          <div>Total hours</div>
          <div className="text-2xl font-bold">
            <FormattedDuration
              title="Total work hours of the selected project"
              minutes={reportGroupedData?.report.groupedByDate
                .map((WorkHourDuration) => WorkHourDuration.duration)
                .reduce((sum, duration) => duration + sum, 0)}
            />
          </div>
          <div className="flex gap-1 font-mono text-sm">
            <FormattedDuration
              title="Total work hours of the selected project"
              minutes={reportGroupedData?.report.groupedByDate
                .map((WorkHourDuration) => WorkHourDuration.duration)
                .reduce((sum, duration) => duration + sum, 0)}
            />
            Uninvoiced billable hours
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
            <div className="border-b">
              <table className="table text-base">
                <thead className="bg-base-200 text-base text-base-content">
                  <tr>
                    <th>Tasks</th>
                    <th>Person</th>
                    <th>Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {reportGroupedData?.report.groupedByDate.map((group) => (
                    <Fragment key={group.date}>
                      <tr className="bg-base-200 font-bold">
                        <td>{group.date}</td>
                        <td />
                        <td>
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
                          <td>{workHour.task.title}</td>
                          <td>{workHour.user?.name}</td>
                          <td>
                            <FormattedDuration title="Work duration" minutes={workHour.duration} />
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                  {/* <tr className="bg-base-200 font-bold">
                    <td>Total by Task</td>
                    <td />
                    <td />
                  </tr>
                  {reportGroupedData?.report.groupedByTask.map((entry) => (
                    <tr key={entry.task.id}>
                      <td>{entry.task.title}</td>
                      <td />
                      <td>
                        <FormattedDuration title="Total by task" minutes={entry.duration} />
                      </td>
                    </tr>
                  ))} */}

                  {/* {reportGroupedData?.report.groupedByUser && (
                    <>
                      <tr className="bg-base-200 font-bold">
                        <td>Total by Person</td>
                        <td />
                        <td />
                      </tr>

                      {reportGroupedData.report.groupedByUser.map((group) => (
                        <tr key={group.user.id}>
                          <td>{group.user.name}</td>
                          <td />
                          <td>
                            <FormattedDuration title="Total by user" minutes={group.duration} />
                          </td>
                        </tr>
                      ))}
                    </>
                  )} */}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-8 pr-4 font-mono text-lg font-bold">
              Total
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
