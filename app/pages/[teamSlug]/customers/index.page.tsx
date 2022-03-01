import { useRouter } from 'next/router'
import { consumers } from 'stream'
import { Customer } from '../../../backend/graphql/customer'
import { Button } from '../../../frontend/components/button/button'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import {
  Table,
  TableBody,
  TableCell,
  TableHeadCell,
  TableHeadRow,
  TableRow,
} from '../../../frontend/components/table/table'
import { CustomerInput, useCustomersQuery } from '../../../frontend/generated/graphql'

const CustomersPage = (): JSX.Element => {
  const router = useRouter()

  const slug = router.query.teamSlug?.toString() ?? ''
  const [{ data }] = useCustomersQuery({ variables: { slug }, pause: !router.isReady })

  const handleAddCustomer = async () => {
    await router.push(`/${slug}/customers/add`)
  }
  const handleCustomerDetails = async (customerId: string) => {
    await router.push(`/${slug}/customers/${customerId}`)
  }
  return (
    <ProtectedPage>
      <article>
        <div className="flex justify-between">
          <h2>Customers</h2>
          <Button ariaLabel="Add" variant="secondarySlim" onClick={handleAddCustomer}>
            Add
          </Button>
        </div>

        <Table className="w-full">
          <TableHeadRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Customer-ID</TableHeadCell>
          </TableHeadRow>
          {data?.teamBySlug.customers.map((customer) => (
            <TableBody key={customer.id}>
              <TableCell>{customer.title}</TableCell>
              <TableCell>{customer.id}</TableCell>

              <TableCell>
                {/* <Button variant="primarySlim" onClick={handleCustomerDetails}> */}
                <Button variant="primarySlim" onClick={() => handleCustomerDetails(customer.id)}>
                  Details
                </Button>
              </TableCell>
            </TableBody>
          ))}
        </Table>
      </article>
    </ProtectedPage>
  )
}

export default CustomersPage
