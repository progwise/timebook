import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useCustomersQuery } from '../../generated/graphql'
import { Button } from '../button/button'
import { ProtectedPage } from '../protectedPage'
import { Table, TableBody, TableCell, TableHeadCell, TableHeadRow, TableRow } from '../table/table'
import { MdPersonAddAlt1 } from 'react-icons/md'
export const CustomerTable = (): JSX.Element => {
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
        <Table className="w-full">
          <TableHeadRow>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Customer-ID</TableHeadCell>
            <TableHeadCell />
          </TableHeadRow>
          <TableBody>
            {data?.teamBySlug.customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.title}</TableCell>
                <TableCell>{customer.id}</TableCell>

                <TableCell>
                  <Button variant="tertiary" onClick={() => handleCustomerDetails(customer.id)}>
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </article>
      <Button ariaLabel="Add" variant="secondary" onClick={handleAddCustomer}>
        <MdPersonAddAlt1 />
        Add
      </Button>
    </ProtectedPage>
  )
}
