import { useRouter } from 'next/router'
import { useMemo } from 'react'
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
import { useCustomersQuery } from '../../../frontend/generated/graphql'

const CustomersPage = (): JSX.Element => {
  const router = useRouter()

  const slug = router.query.teamSlug?.toString() ?? ''
  const context = useMemo(() => ({ additionalTypenames: ['Customer'] }), [])
  const [{ data }] = useCustomersQuery({ variables: { slug }, pause: !router.isReady, context })

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
            <TableHeadCell>Details</TableHeadCell>
          </TableHeadRow>
          <TableBody>
            {data?.teamBySlug.customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.title}</TableCell>
                <TableCell>{customer.id}</TableCell>

                <TableCell>
                  <Button variant="primarySlim" onClick={() => handleCustomerDetails(customer.id)}>
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </article>
    </ProtectedPage>
  )
}

export default CustomersPage
