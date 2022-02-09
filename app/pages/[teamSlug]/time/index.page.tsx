import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { BiEdit, BiPlus, BiTimer } from 'react-icons/bi'
import { BookWorkHourModal, WorkHourItem } from '../../../frontend/components/bookWorkHourModal'
import { Button } from '../../../frontend/components/button/button'
import { CalendarSelector } from '../../../frontend/components/calendarSelector'
import { FormattedDuration } from '../../../frontend/components/duration/formattedDuration'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { useWorkHoursQuery } from '../../../frontend/generated/graphql'

const MaintainWorkHoursPage = () => {
  const [isBookWorkHourModalOpen, setIsBookWorkHourModalOpen] = useState(false)
  const [selectedWorkHourItem, setSelectedWorkHourItem] = useState<WorkHourItem | undefined>()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd')
  const context = useMemo(() => ({ additionalTypenames: ['WorkHour'] }), [])
  const [{ data }, executeWorkhoursQuery] = useWorkHoursQuery({ variables: { from: selectedDateString }, context })
  const handleEditWorkItem = (workHourItem: WorkHourItem) => {
    setSelectedWorkHourItem(workHourItem)
    setIsBookWorkHourModalOpen(true)
  }
  const handleAddWorkItem = () => {
    setSelectedWorkHourItem({
      date: selectedDate,
      duration: 0,
    })
    setIsBookWorkHourModalOpen(true)
  }

  const handleModalClose = () => {
    setIsBookWorkHourModalOpen(false)
    executeWorkhoursQuery({ requestPolicy: 'network-only' })
  }
  return (
    <ProtectedPage>
      {isBookWorkHourModalOpen && (
        <BookWorkHourModal
          onClose={handleModalClose}
          workHourItem={{
            date: selectedDate,
            taskId: selectedWorkHourItem?.taskId,
            duration: selectedWorkHourItem?.duration ?? 0,
            comment: selectedWorkHourItem?.comment,
            workHourId: selectedWorkHourItem?.workHourId,
            projectId: selectedWorkHourItem?.projectId,
          }}
        />
      )}

      <nav className="mt-5 mb-5 flex items-center justify-between">
        <CalendarSelector onSelectedDateChange={setSelectedDate} />
        <Button ariaLabel="add work item" variant="primary" onClick={handleAddWorkItem}>
          <BiPlus className="text-3xl" />
        </Button>
      </nav>
      <section className="mt-5 flex-row gap-2">
        {data?.workHours.map((item) => (
          <article key={item.id} className="flex items-center justify-between gap-1 border-t-2  pt-4 pb-4">
            <header className="w-1/2">
              <h1 className="font-bold">{item.project.title}</h1>
              <h2 className="font-semibold">{item.task.title}</h2>
              {item.comment && <p>{item.comment}</p>}
            </header>
            <div className="w-1/4 text-right text-2xl">
              <FormattedDuration title="Task work for the selected day" minutes={item.duration} />
            </div>
            <div className="flex w-1/4 justify-end gap-2">
              <Button variant="primary" ariaLabel="Timer">
                <BiTimer />
                Start
              </Button>
              <Button
                variant="secondary"
                ariaLabel="Edit"
                onClick={() =>
                  handleEditWorkItem({
                    workHourId: Number.parseInt(item.id, 10),
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
          </article>
        ))}
      </section>
      <article className="mt-2 flex items-center justify-between border-t-2">
        <header className="w-1/2">
          <h1 className="text-xl">Total</h1>
        </header>
        <div className="w-1/4 text-right text-2xl">
          <FormattedDuration
            title="Total work for the selected day"
            minutes={data?.workHours.map((item) => item.duration).reduce((sum, duration) => duration + sum, 0)}
          />
        </div>
        <div className="w-1/4">{''}</div>
      </article>
    </ProtectedPage>
  )
}

export default MaintainWorkHoursPage
