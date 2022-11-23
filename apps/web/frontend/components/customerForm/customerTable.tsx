import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { MdPersonAddAlt1 } from 'react-icons/md'

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableHeadRow,
  TableRow,
} from '@progwise/timebook-ui'

import { useCustomersQuery } from '../../generated/graphql'
import { ProtectedPage } from '../protectedPage'

export const CustomerTable = (): JSX.Element => {
  const router = useRouter()
  const slug = router.query.teamSlug?.toString() ?? ''
  const context = useMemo(() => ({ additionalTypenames: ['Customer'] }), [])
  const [{ data }] = useCustomersQuery({ pause: !router.isReady, context, variables: { slug } })

  const handleAddCustomer = async () => {
    await router.push(`/${slug}/customers/add`)
  }
  const handleCustomerDetails = async (customerId: string) => {
    await router.push(`/${slug}/customers/${customerId}`)
  }

  return (
    <ProtectedPage>
      <article>
        <Table>
          <TableHead>
            <TableHeadRow>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Customer-ID</TableHeadCell>
              <TableHeadCell />
            </TableHeadRow>
          </TableHead>
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
