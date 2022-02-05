import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { BiEdit, BiPlus, BiTimer } from 'react-icons/bi'
import { BookWorkHourModal } from '../../../frontend/components/bookWorkHourModal'
import { Button } from '../../../frontend/components/button/button'
import { CalendarSelector } from '../../../frontend/components/calendarSelector'
import { FormattedDuration } from '../../../frontend/components/duration/formattedDuration'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { useWorkHoursQuery } from '../../../frontend/generated/graphql'

const TimeDetails = () => {
  const [isBookWorkHourModalOpen, setIsBookWorkHourModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd')
  const context = useMemo(() => ({ additionalTypenames: ['WorkHour'] }), [])
  const [{ data }] = useWorkHoursQuery({ variables: { from: selectedDateString }, context })

  return (
    <ProtectedPage>
      <BookWorkHourModal
        selectedDate={selectedDate}
        open={isBookWorkHourModalOpen}
        onClose={() => setIsBookWorkHourModalOpen(false)}
      />
      <nav className="mt-5 mb-5 flex items-center justify-between">
        <CalendarSelector onSelectedDateChange={setSelectedDate} />
        <Button variant="primary" onClick={() => setIsBookWorkHourModalOpen(true)}>
          <BiPlus className="flex items-end text-3xl" />
        </Button>
      </nav>
      <section className="mt-5 flex-row gap-2">
        {data?.workHours.map((item) => (
          <article key={item.id} className="pt-4 pb-4 flex items-center justify-between  gap-1 border-t-2">
            <header className="w-1/2">
              <h1 className="font-bold">{item.project.title}</h1>
              <h2 className="font-semibold">{item.task.title}</h2>
              {item.comment && <p>{item.comment}</p>}
            </header>
            <div className="w-1/4 text-right text-2xl">
              <FormattedDuration minutes={item.duration} />
            </div>
            <div className="flex w-1/4 justify-end gap-2">
              <Button variant="primary">
                <BiTimer />
                Start
              </Button>
              <Button variant="secondary">
                <BiEdit />
                Edit
              </Button>
            </div>
          </article>
        ))}
      </section>
      <article className="border-t-2 mt-2 flex items-center justify-between">
        <header className="w-1/2">
          <h1 className="text-xl">Total</h1>
        </header>
        <div className="w-1/4 text-right text-2xl">
          <FormattedDuration
            minutes={data?.workHours.map((item) => item.duration).reduce((duration, sum) => duration + sum)}
          />
        </div>
        <div className="w-1/4">{''}</div>
      </article>
    </ProtectedPage>
  )
}

export default TimeDetails
