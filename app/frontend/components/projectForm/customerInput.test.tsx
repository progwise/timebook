import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { Client, Provider } from 'urql'
import { CustomerInput } from './customerInput'
import '../../mocks/mockServer'

jest.mock('next/router', () => ({
  useRouter: () => ({
    isReady: true,
  }),
}))

interface FormState {
  customerId: string | null
}

const HelperForm = (props: { onSubmit: () => void }) => {
  const { control, handleSubmit } = useForm<FormState>({ defaultValues: { customerId: 'customer1' } })

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <CustomerInput control={control} name="customerId" />
      <button type="submit">Submit</button>
    </form>
  )
}

const client = new Client({ url: '/api/graphql' })
const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>

describe('CustomerInput', () => {
  it('should be possible to select an existing customer', async () => {
    const onSubmit = jest.fn()
    render(<HelperForm onSubmit={onSubmit} />, { wrapper })

    const combobox = screen.getByRole('combobox')

    userEvent.type(combobox, '{arrowdown}')

    await screen.findByRole('option', { name: 'Customer 1' })
    const customer2Option = await screen.findByRole('option', { name: 'Customer 2' })

    expect(combobox).toHaveValue('Customer 1')

    userEvent.click(customer2Option)
    expect(combobox).toHaveValue('Customer 2')

    const submitButton = screen.getByRole('button', {name: 'Submit'})
    userEvent.click(submitButton)

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ customerId: 'customer2'}, expect.any(Object)))
  })

  it.todo('should be possible to select no customer')
  it.todo('should be possible to create and select a new customer')
})
