import { PageHeading } from '../frontend/components/pageHeading'
import { ProtectedPage } from '../frontend/components/protectedPage'
import { WorkHoursSheet } from '../frontend/components/timeSheetView/workHoursSheet'

const SheetPage = (): JSX.Element => (
  <ProtectedPage>
    <PageHeading>Work Hours Sheet</PageHeading>
    <WorkHoursSheet />
  </ProtectedPage>
)

export default SheetPage
