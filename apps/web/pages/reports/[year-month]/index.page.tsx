import { parse } from 'date-fns'
import { useRouter } from 'next/router'

import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { ReportForm } from '../../../frontend/components/reportForm/reportForm'

const ReportsPage = (): JSX.Element => {
  const router = useRouter()
  const date = router.query['year-month']?.toString() ?? ''

  const selectedDate = parse(date, 'yyyy-MM', new Date())

  return (
    <ProtectedPage>
      <ReportForm date={selectedDate} />
    </ProtectedPage>
  )
}

export default ReportsPage
