import { endOfMonth, format, formatISO, getMonth, getYear, parse, startOfMonth } from 'date-fns'
import { useRouter } from 'next/router'
import { Fragment, useMemo, useState } from 'react'
import { BiPrinter } from 'react-icons/bi'
import { useQuery } from 'urql'

import { Button, FormattedDuration, ListboxWithUnselect } from '@progwise/timebook-ui'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
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
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>()
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
      userId: selectedUserId,
      groupByUser: !selectedUserId,
    },
    context,
    pause: !router.isReady || !projectId,
  })

  const selectedProject = projects?.find((project) => project.id === projectId)
  const userIsAdmin = selectedProject?.role === 'ADMIN'

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <PageHeading>
            Detailed time report: {fromString} - {endString}
          </PageHeading>
          <Button variant="secondary" className="px-6 print:hidden" onClick={() => print()}>
            <BiPrinter /> Print
          </Button>
        </div>
        <PageHeading>Select a project</PageHeading>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="flex flex-row items-start gap-4">
            <ListboxWithUnselect
              value={selectedProject}
              getLabel={(project) => project.title}
              getKey={(project) => project.id}
              onChange={(project) => router.push(`/reports/${format(date, 'yyyy-MM')}/${project?.id ?? ''}`)}
              options={projects ?? []}
              noOptionLabel="Select Project"
            />
            <input
              className="rounded-lg border-none py-2 pl-3 text-sm leading-5  shadow-md dark:bg-slate-700"
              type="month"
              value={format(date, 'yyyy-MM')}
              onChange={(event) => {
                if (event.target.value) {
                  router.push(`/reports/${event.target.value}/${projectId ?? ''}`)
                }
              }}
            />
            {selectedProject && <ProjectLockButton year={year} month={month} project={selectedProject} />}
          </div>
          <div>
            {projectId && (
              <ReportUserSelect
                projectId={projectId}
                selectedUserId={selectedUserId}
                onUserChange={(newUserId) => setSelectedUserId(newUserId)}
                from={from}
                to={to}
              />
            )}
          </div>
        </div>

        {projectId && reportGroupedData && selectedUserId && userIsAdmin && (
          <section className="mt-10 grid w-full grid-cols-3 gap-2 text-left">
            <article className="contents border-y text-lg">
              <hr className="col-span-3 -mb-2 h-0.5 bg-gray-600" />
              <strong>Tasks</strong>
              <strong>Person</strong>
              <strong>Hours</strong>
            </article>
            {reportGroupedData?.report.groupedByDate.map((group) => (
              <Fragment key={group.date}>
                <article className="contents">
                  <hr className="col-span-3 -mt-2 h-0.5 bg-gray-700 " />
                  <strong className="col-span-2">{group.date}</strong>
                  <FormattedDuration
                    title="Total work hours of the day"
                    minutes={group.workHours
                      .map((WorkHourDuration) => WorkHourDuration.duration)
                      .reduce((sum, duration) => duration + sum, 0)}
                  />
                </article>
                {group.workHours.map((workHour) => (
                  <article key={workHour.id} className="contents">
                    <h1>{workHour.task.title}</h1>
                    <span>{workHour.user?.name}</span>
                    <FormattedDuration title="Work duration" minutes={workHour.duration} />
                  </article>
                ))}
              </Fragment>
            ))}
            <article className="contents">
              <hr className="col-span-3 -mt-2 h-0.5 bg-gray-600" />
              <strong className="col-span-2">Total</strong>
              <FormattedDuration
                title="Total work hours of the selected project"
                minutes={reportGroupedData?.report.groupedByDate
                  .map((WorkHourDuration) => WorkHourDuration.duration)
                  .reduce((sum, duration) => duration + sum, 0)}
              />
            </article>
            <article className="contents">
              <hr className="col-span-3 my-8 h-0.5 border-0 bg-gray-600" />
              <strong className="col-span-3">Total by Task</strong>
              {reportGroupedData?.report.groupedByTask.map((entry) => (
                <div key={entry.task.id} className="grid grid-flow-row">
                  <span>{entry.task.title}</span>
                  <FormattedDuration title="Total by task" minutes={entry.duration} />
                </div>
              ))}
              <hr className="col-span-3 my-8 h-0.5 border-0 bg-gray-600" />
            </article>
            {reportGroupedData?.report.groupedByUser && (
              <article className="contents">
                <strong className="col-span-3">Total by Person</strong>
                {reportGroupedData.report.groupedByUser.map((group) => (
                  <div key={group.user.id} className="grid grid-flow-row">
                    <span>{group.user.name}</span>
                    <FormattedDuration title="Total by user" minutes={group.duration} />
                  </div>
                ))}
                <hr className="col-span-3 -mt-2 h-0.5 bg-gray-600" />
              </article>
            )}
          </section>
        )}
      </div>
    </>
  )
}
