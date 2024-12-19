import { render, screen } from '@testing-library/react'
import { cacheExchange, Client, fetchExchange, Provider } from 'urql'

import '../../../../../frontend/mocks/mockServer'
import InvoiceDetailsPage from './index.page'

const client = new Client({ url: '/api/graphql', exchanges: [cacheExchange, fetchExchange] })

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider value={client}>{children}</Provider>
)

jest.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'authenticated', data: { user: { id: '1' } } }),
}))

jest.mock('next/router', () => ({
  useRouter() {
    return {
      query: { invoiceId: '1', organizationId: '1' },
      isReady: true,
      push: jest.fn(),
    }
  },
}))

it('should render invoice details', async () => {
  render(<InvoiceDetailsPage />, { wrapper })

  const invoiceElements = await screen.findAllByText('INVOICE', { exact: false })
  expect(invoiceElements).toHaveLength(3)
  expect(screen.getByText('Progwise')).toBeInTheDocument()
  expect(screen.getByText('Greifswald')).toBeInTheDocument()
  expect(screen.getByText('Invoice No: #1')).toBeInTheDocument()
})

it('should render invoice items', async () => {
  render(<InvoiceDetailsPage />, { wrapper })

  await screen.findByText('Task')
  expect(screen.getByText('5')).toBeInTheDocument()
  expect(screen.getByText('20')).toBeInTheDocument()
  expect(screen.getByText('100')).toBeInTheDocument()
})
