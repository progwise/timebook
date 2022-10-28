import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Client, Provider } from 'urql'
import { ProjectForm } from './projectForm'
import '../../../frontend/mocks/mockServer'

jest.mock('next/router', () => ({
  useRouter: () => ({
    isReady: true,
  }),
}))
const client = new Client({ url: '/api/team1/graphql' })
const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>

describe('projectForm', () => {
  it('should submit a new project', async () => {
    const onSubmit = jest.fn()
    render(<ProjectForm onSubmit={onSubmit} onCancel={jest.fn()} hasError={false} />, {
      wrapper,
    })
    const nameInput = screen.getByRole('textbox', { name: /name/i })
    const startInput = screen.getByRole('textbox', { name: /start/i })
    const endInput = screen.getByRole('textbox', { name: /end/i })
    const submitButton = screen.getByRole('button', { name: /save/i })

    await userEvent.type(nameInput, 'new project')
    await userEvent.type(startInput, '2022-04-12')
    await userEvent.type(endInput, '2022-04-13')
    await userEvent.click(submitButton)

    expect(onSubmit).toHaveBeenNthCalledWith(1, { title: 'new project', start: '2022-04-12', end: '2022-04-13' })
  })

  it('should be possible to delete start and end date', async () => {
    const onSubmit = jest.fn()
    render(
      <ProjectForm
        project={{
          title: 'old project',
          __typename: 'Project',
          canModify: true,
          id: '1',
          startDate: '2022-03-21',
          endDate: '2023-03-21',
        }}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
        hasError={false}
      />,
      { wrapper },
    )

    const startInput = screen.getByRole('textbox', { name: /start/i })
    const endInput = screen.getByRole('textbox', { name: /end/i })
    const submitButton = screen.getByRole('button', { name: /save/i })

    await userEvent.clear(startInput)
    await userEvent.clear(endInput)
    await userEvent.click(submitButton)

    // eslint-disable-next-line unicorn/no-null
    expect(onSubmit).toHaveBeenNthCalledWith(1, { title: 'old project', start: null, end: null })
  })

  it('should not be possible to create a project with an end date before the start', async () => {
    const onSubmit = jest.fn()
    render(
      <ProjectForm
        project={{
          title: 'test project',
          __typename: 'Project',
          canModify: true,
          id: '1',
          startDate: '2023-03-22',
          endDate: '2022-03-22',
        }}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
        hasError={false}
      />,
    )
    const startInput = screen.getByRole('textbox', {
      name: /start/i,
    })
    const submitButton = screen.getByRole('button', { name: /save/i })
    const endInput = screen.getByRole('textbox', {
      name: /end/i,
    })

    await userEvent.clear(startInput)
    await userEvent.type(startInput, '2023-03-22')

    await userEvent.clear(endInput)
    await userEvent.type(endInput, '2022-03-22')
    await userEvent.click(submitButton)
    expect(onSubmit).toHaveBeenCalledWith(startInput < endInput)
  })
})
