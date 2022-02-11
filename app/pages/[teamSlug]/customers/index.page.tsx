import { useRouter } from 'next/router'
import { Button } from '../../../frontend/components/button/button'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { useCustomersQuery } from '../../../frontend/generated/graphql'

const CustomersPage = (): JSX.Element => {
  const router = useRouter()

  const slug = router.query.teamSlug?.toString() ?? ''
  const [{ data }] = useCustomersQuery({ variables: { slug }, pause: !router.isReady })

  const handleAddCustomer = async () => {
    await router.push(`/${slug}/customers/add`)
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

        <table className="w-full">
          <tr>
            <th>Name</th>
            <th>Customer-ID</th>
          </tr>
          {data?.teamBySlug.customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.title}</td>
              <td>{customer.id}</td>
            </tr>
          ))}
        </table>
      </article>
    </ProtectedPage>
  )
}

export default CustomersPage
