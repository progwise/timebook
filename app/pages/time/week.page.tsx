import { DayWeekSwitch } from '../../frontend/components/dayWeekSwitchButton'
import { ProtectedPage } from '../../frontend/components/protectedPage'

import { Button } from '../../frontend/components/button/button'
import { BiPlus } from 'react-icons/bi'

const WeekTime = (): JSX.Element => {
  return (
    <ProtectedPage>
      <div className="flex flex-col items-end">
        <Button ariaLabel="Add" variant="primary">
          <BiPlus className="flex items-end text-3xl" />
        </Button>
      </div>
      <article className="timebook">
        <DayWeekSwitch selectedButton="day" />
        <h2>Your timetable for week</h2>
      </article>
    </ProtectedPage>
  )
}

export default WeekTime
