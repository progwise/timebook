import { ProtectedPage } from '../../frontend/components/protectedPage'
import { ReportForm } from '../../frontend/components/reportForm/reportForm'

const ReportsPage = (): JSX.Element => {
  return (
    <ProtectedPage>
      <ReportForm date={new Date()} />
    </ProtectedPage>
  )
}

export default ReportsPage
