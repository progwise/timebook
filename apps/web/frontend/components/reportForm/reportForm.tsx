import { endOfMonth, format, formatISO, parse, startOfMonth } from 'date-fns'
import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'

import { FormattedDuration } from '@progwise/timebook-ui'

import { ProjectFilter, ProjectFragment, useMyProjectsQuery, useReportQuery } from '../../generated/graphql'
import { ComboBox } from '../combobox/combobox'

export const ReportForm = () => {
  const router = useRouter()
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>()
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM'))
  const [{ data: projectsData }] = useMyProjectsQuery({ variables: { from: date, filter: ProjectFilter.All } })

  const parsedDate = parse(date, 'yyyy-MM', new Date())

  const startOfMonthString = formatISO(startOfMonth(parsedDate), { representation: 'date' })
  const endOfMonthString = formatISO(endOfMonth(parsedDate), { representation: 'date' })

  const [{ data: reportGroupedData }] = useReportQuery({
    variables: {
      projectId: selectedProjectId ?? '',
      from: startOfMonthString,
      to: endOfMonthString,
    },
    pause: !router.isReady || !selectedProjectId,
  })

  const selectedProject: ProjectFragment | undefined = projectsData?.projects.find(
    (project) => project.id === selectedProjectId,
  )

  const handleChange = (selectedProjectId: string | null) => {
    setSelectedProjectId(selectedProjectId ?? undefined)
  }

  return (
    <>
      <div>
        <h1 className="mb-4 mt-4 font-bold">
          Detailed time report: {startOfMonthString} - {endOfMonthString}
        </h1>
        <h2>Select a project</h2>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="flex flex-row">
            <ComboBox<ProjectFragment>
              value={selectedProject}
              displayValue={(project) => project.title}
              noOptionLabel="No Project"
              onChange={handleChange}
              options={projectsData?.projects ?? []}
            />
          </div>
          <div>
            <input
              className="rounded-lg border-none py-2 pl-3 text-sm leading-5  shadow-md dark:bg-slate-700"
              type="month"
              value={date}
              onChange={(event) => {
                if (event.target.value) {
                  setDate(event.target.value)
                }
              }}
            />
          </div>
        </div>
        {selectedProject && (
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
            </article>
            <article className="contents">
              <hr className="col-span-3 my-8 h-0.5 border-0 bg-gray-600" />
              <strong className="col-span-3">Total by Person</strong>
              {reportGroupedData?.report.groupedByUser.map((group) => (
                <div key={group.user.id} className="grid grid-flow-row">
                  <span>{group.user.name}</span>
                  <FormattedDuration title="Total by user" minutes={group.duration} />
                </div>
              ))}
              <hr className="col-span-3 -mt-2 h-0.5 bg-gray-600" />
            </article>
          </section>
        )}
      </div>
    </>
  )
}
