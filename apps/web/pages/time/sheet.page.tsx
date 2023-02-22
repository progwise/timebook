import { startOfWeek } from 'date-fns'

import { WorkHoursSheet } from '../../frontend/components/timeSheetView/workHoursSheet'

const SheetPage = (): JSX.Element => {
  const startOfTheWeek = startOfWeek(new Date(), { weekStartsOn: 1 })

  return (
    <>
      <WorkHoursSheet startDate={startOfTheWeek} />
    </>
  )
}
export default SheetPage
