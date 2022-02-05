import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import { BiEdit, BiPlus, BiTimer, BiTrash } from 'react-icons/bi'
import { BookWorkHourModal } from '../../../frontend/components/bookWorkHourModal'
import { Button } from '../../../frontend/components/button/button'
import { CalendarSelector } from '../../../frontend/components/calendarSelector'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { useWorkHoursQuery } from '../../../frontend/generated/graphql'
const formatDuration = (minutes: number | undefined) =>
  !minutes ? '0:00' : `${Math.floor(minutes / 60)}:${('0' + (minutes % 60)).slice(-2)}`
const TimeDetails = () => {
  const [isBookWorkHourModalOpen, setIsBookWorkHourModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd')
  const context = useMemo(() => ({ additionalTypenames: ['WorkHour'] }), [])
  const [{ data }] = useWorkHoursQuery({ variables: { from: selectedDateString }, context })

  return (
    <ProtectedPage>
      <nav className="mt-5 flex justify-between">
        <Button variant="primary" onClick={() => setIsBookWorkHourModalOpen(true)}>
          <BiPlus className="flex items-end text-3xl" />
        </Button>
        <BookWorkHourModal
          selectedDate={selectedDate}
          open={isBookWorkHourModalOpen}
          onClose={() => setIsBookWorkHourModalOpen(false)}
        />
        <CalendarSelector onSelectedDateChange={setSelectedDate} />
      </nav>
      {data?.workHours.map((item) => (
        <article key={item.id} className="flex items-center justify-between">
          <header className="w-1/2">
            <h1 className="font-bold">{item.project.title}</h1>
            <h2 className="font-semibold">{item.task.title}</h2>
            {item.comment && <p>{item.comment}</p>}
          </header>
          <div className="w-1/4 text-right text-2xl">
            <p>{formatDuration(item.duration)}</p>
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
      <article className="flex items-center justify-between">
        <header className="w-1/2">
          <h1 className="text-xl">Total for {selectedDateString}</h1>
        </header>
        <div className="w-1/4 text-right text-2xl">
          {formatDuration(data?.workHours.map((item) => item.duration).reduce((duration, sum) => duration + sum))}
        </div>
        <div className="w-1/4">{''}</div>
      </article>
    </ProtectedPage>
  )
}

export default TimeDetails
