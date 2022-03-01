import { Combobox, Transition } from '@headlessui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ProjectFragment, useProjectsQuery, useWorkHoursQuery } from '../../generated/graphql'
import { HiCheck, HiSelector } from 'react-icons/hi'
import { endOfMonth, format, formatISO, parse, startOfMonth } from 'date-fns'
import { FormattedDuration } from '../duration/formattedDuration'

const ReportForm = () => {
  const router = useRouter()
  const [{ data: projectsData }] = useProjectsQuery({ pause: !router.isReady })
  const [selectedProject, setSelectedProject] = useState<ProjectFragment | undefined>()
  const [, setProjectQuery] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM'))

  const parsedDate = parse(date, 'yyyy-MM', new Date())

  const startOfMonthString = formatISO(startOfMonth(parsedDate), { representation: 'date' })
  const endOfMonthString = formatISO(endOfMonth(parsedDate), { representation: 'date' })

  const [{ data: workHoursData }] = useWorkHoursQuery({
    variables: { from: startOfMonthString, to: endOfMonthString },
    pause: !router.isReady,
  })

  const filteredWorkHour = workHoursData?.workHours.filter((workHour) => workHour.project.id === selectedProject?.id)

  return (
    <>
      <div>
        {
          <h1 className="mb-4 font-bold">
            Detailed time report: {startOfMonthString} - {endOfMonthString}
          </h1>
        }
        <h2>Select a project</h2>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div>
            <Combobox value={selectedProject} onChange={setSelectedProject}>
              <div>
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                  <Combobox.Input<'input', ProjectFragment>
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={(project) => project.title}
                    onChange={(event) => setProjectQuery(event.target.value)}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <HiSelector className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </Combobox.Button>
                  <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Combobox.Options>
                      {projectsData?.projects.map((project) => (
                        <Combobox.Option
                          key={project.id}
                          value={project}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-teal-600 text-white' : 'text-gray-900'
                            }`
                          }
                        >
                          {({ selected, active }) => (
                            <>
                              <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                {project.title}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? 'text-white' : 'text-teal-600'
                                  }`}
                                >
                                  <HiCheck className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : undefined}
                            </>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </Transition>
                </div>
              </div>
            </Combobox>
          </div>
          <div>
            <input
              className="relative rounded-lg border-none py-2 pl-3 pr-10 text-sm leading-5 shadow-md"
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
        <section className="mt-10 grid w-full grid-cols-4 gap-2 border-y-4 text-left">
          <article className="contents border-y text-lg">
            <strong>Tasks</strong>
            <strong>Comment</strong>
            <strong>Person</strong>
            <strong>Hours</strong>
          </article>
          {filteredWorkHour?.map((workHour) => (
            <article key={workHour.id} className="contents">
              <h1>{workHour.task.title}</h1>
              <span>{workHour.comment}</span>
              <span>{workHour.user?.name}</span>
              <span>{workHour.duration}</span>
            </article>
          ))}
          <article className="contents">
            <span className="col-span-2" />
            <strong>Total</strong>
            <FormattedDuration
              title="Total work for the selected day"
              minutes={filteredWorkHour?.map((item) => item.duration).reduce((sum, duration) => duration + sum, 0)}
            />
          </article>
        </section>
      </div>
    </>
  )
}

export default ReportForm
