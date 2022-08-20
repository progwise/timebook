import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { BiEdit, BiPlus, BiTimer } from 'react-icons/bi'
import { BookWorkHourModal, WorkHourItem } from '../../../frontend/components/bookWorkHourModal'
import { Button } from '../../../frontend/components/button/button'
import { CalendarSelector } from '../../../frontend/components/calendarSelector'
import { DayWeekSwitch } from '../../../frontend/components/dayWeekSwitchButton'
import { FormattedDuration } from '../../../frontend/components/duration/formattedDuration'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { useWorkHoursQuery } from '../../../frontend/generated/graphql'

const MaintainWorkHoursPage = () => {
  const [isBookWorkHourModalOpen, setIsBookWorkHourModalOpen] = useState(false)
  const [selectedWorkHourItem, setSelectedWorkHourItem] = useState<WorkHourItem | undefined>()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd')
  const context = useMemo(() => ({ additionalTypenames: ['WorkHour'] }), [])
  const router = useRouter()
  const teamSlug = router.query.teamSlug?.toString() ?? ''
  const [{ data }] = useWorkHoursQuery({ variables: { teamSlug, from: selectedDateString }, context })
  const handleEditWorkItem = (workHourItem: WorkHourItem) => {
    setSelectedWorkHourItem(workHourItem)
    setIsBookWorkHourModalOpen(true)
  }
  const handleAddWorkItem = () => {
    setSelectedWorkHourItem({
      date: selectedDate,
      duration: 0,
      taskId: '',
      projectId: '',
    })
    setIsBookWorkHourModalOpen(true)
  }

  const handleModalClose = () => {
    setIsBookWorkHourModalOpen(false)
  }
  return (
    <ProtectedPage>
      {isBookWorkHourModalOpen && (
        <BookWorkHourModal
          onClose={handleModalClose}
          workHourItem={{
            date: selectedDate,
            taskId: selectedWorkHourItem?.taskId ?? '',
            duration: selectedWorkHourItem?.duration ?? 0,
            comment: selectedWorkHourItem?.comment,
            workHourId: selectedWorkHourItem?.workHourId,
            projectId: selectedWorkHourItem?.projectId ?? '',
          }}
        />
      )}

      <nav className="mt-5 mb-5 flex items-center justify-between">
        <CalendarSelector onSelectedDateChange={setSelectedDate} />
        <Button ariaLabel="add work item" variant="primary" onClick={handleAddWorkItem}>
          <BiPlus className="text-3xl" />
        </Button>
      </nav>
         <DayWeekSwitch selectedButton={"day"} />
      <section className="mt-5 grid grid-cols-4 gap-6 divide-y divide-solid">
        {data?.workHours.map((item) => (
          <article key={item.id} className="contents border-2 border-black">
            <header className="col-span-2 ">
              <h1 className="font-bold">{item.project.title}</h1>
              <h2 className="font-semibold">{item.task.title}</h2>
              {item.comment && <p>{item.comment}</p>}
            </header>
            <div className="text-right text-2xl">
              <FormattedDuration title="Task work for the selected day" minutes={item.duration} />
            </div>
            <div className="flex justify-end gap-2 ">
              <Button variant="primary">
                <BiTimer />
                Start
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  handleEditWorkItem({
                    workHourId: item.id,
                    date: selectedDate,
                    duration: item.duration,
                    comment: item.comment ?? undefined,
                    projectId: item.project.id,
                    taskId: item.task.id,
                  })
                }
              >
                <BiEdit />
                Edit
              </Button>
            </div>
            <hr className=" col-span-4 border-gray-500" />
          </article>
        ))}
        <article className="  contents  pt-4">
          <header className=" col-span-2 ">
            <h1 className="  text-xl ">Total</h1>
          </header>
          <div className="justify-self-end text-2xl">
            <FormattedDuration
              title="Total work for the selected day"
              minutes={data?.workHours.map((item) => item.duration).reduce((sum, duration) => duration + sum, 0)}
            />
          </div>
        </article>
      </section>
    </ProtectedPage>

  )
}

export default MaintainWorkHoursPage
