/* eslint-disable unicorn/no-null */
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { cacheExchange, Client, fetchExchange, Provider } from 'urql'

import { makeFragmentData } from '../../generated/gql'
import '../../mocks/mockServer'
import { OrganizationFragment, ProjectForm, ProjectFormFragment } from './projectForm'

jest.mock('next/router', () => ({
  useRouter: () => ({
    isReady: true,
    push: jest.fn(),
  }),
}))
const client = new Client({ url: '/api/graphql', exchanges: [cacheExchange, fetchExchange] })
const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider value={client}>{children}</Provider>
)

const organizations = [
  makeFragmentData({ id: 'O1', title: 'Organization 1', isArchived: false }, OrganizationFragment),
  makeFragmentData({ id: 'O2', title: 'Organization 2', isArchived: true }, OrganizationFragment),
]

describe('projectForm', () => {
  it('should submit a new project', async () => {
    const onSubmit = jest.fn()
    render(<ProjectForm onSubmit={onSubmit} onCancel={jest.fn()} hasError={false} organizations={organizations} />, {
      wrapper,
    })
    const nameInput = screen.getByRole('textbox', { name: /name/i })
    const startInput = screen.getByRole('textbox', { name: /start/i })
    const endInput = screen.getByRole('textbox', { name: /end/i })
    const submitButton = screen.getByRole('button', { name: /create/i })

    await userEvent.type(nameInput, 'new project')
    await userEvent.type(startInput, '2022-04-12')
    await userEvent.type(endInput, '2022-04-13')
    expect(endInput).toHaveValue('2022-04-13')

    await userEvent.click(submitButton)

    expect(onSubmit).toHaveBeenNthCalledWith(1, {
      title: 'new project',
      start: '2022-04-12',
      end: '2022-04-13',
      organizationId: null,
    })
  })

  it('should be possible to delete start and end date', async () => {
    const onSubmit = jest.fn()
    render(
      <ProjectForm
        project={makeFragmentData(
          {
            id: '1',
            title: 'old project',
            startDate: '2022-03-21',
            endDate: '2022-03-21',
            canModify: true,
            hasWorkHours: false,
          },
          ProjectFormFragment,
        )}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
        hasError={false}
        organizations={organizations}
      />,
      { wrapper },
    )

    const startInput = screen.getByRole('textbox', { name: /start/i })
    const endInput = screen.getByRole('textbox', { name: /end/i })
    const submitButton = screen.getByRole('button', { name: /save/i })

    await userEvent.clear(startInput)
    await userEvent.clear(endInput)
    await userEvent.click(submitButton)

    expect(onSubmit).toHaveBeenNthCalledWith(1, {
      title: 'old project',
      start: null,
      end: null,
      organizationId: null,
    })
  })
  it('should not be possible to enter an end date earlier as the start', async () => {
    const onSubmit = jest.fn()
    render(
      <ProjectForm
        project={makeFragmentData(
          {
            id: '1',
            title: 'test project',
            startDate: '2022-04-12',
            endDate: '',
            canModify: true,
            hasWorkHours: false,
          },
          ProjectFormFragment,
        )}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
        hasError={false}
        organizations={organizations}
      />,
      { wrapper },
    )

    const endInput = screen.getByRole('textbox', { name: /end/i })
    const submitButton = screen.getByRole('button', { name: /save/i })

    await userEvent.type(endInput, '2022-04-10')
    await userEvent.click(submitButton)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('should be possible to have a open end project', async () => {
    const onSubmit = jest.fn()
    render(
      <ProjectForm
        project={makeFragmentData(
          {
            id: '1',
            title: 'test project',
            startDate: '2022-04-12',
            endDate: '2022-05-12',
            canModify: true,
            hasWorkHours: false,
          },
          ProjectFormFragment,
        )}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
        hasError={false}
        organizations={organizations}
      />,
      { wrapper },
    )

    const submitButton = screen.getByRole('button', { name: /save/i })
    const endInput = screen.getByRole('textbox', { name: /end/i })

    await userEvent.clear(endInput)
    await userEvent.click(submitButton)

    expect(onSubmit).toHaveBeenNthCalledWith(1, {
      end: null,
      start: '2022-04-12',
      title: 'test project',
      organizationId: null,
    })
  })

  it('should be possible to add project to an organization', async () => {
    const onSubmit = jest.fn()
    render(
      <ProjectForm
        project={makeFragmentData(
          {
            id: '1',
            title: 'test project',
            startDate: '2022-04-12',
            endDate: '',
            canModify: true,
            hasWorkHours: false,
          },
          ProjectFormFragment,
        )}
        onSubmit={onSubmit}
        onCancel={jest.fn()}
        hasError={false}
        organizations={organizations}
      />,
      { wrapper },
    )

    const submitButton = screen.getByRole('button', { name: /save/i })
    const organizationSelect = screen.getByRole('combobox', { name: /organization/i })

    await userEvent.selectOptions(organizationSelect, 'O1')
    await userEvent.click(submitButton)

    expect(onSubmit).toHaveBeenNthCalledWith(1, {
      end: null,
      start: '2022-04-12',
      title: 'test project',
      organizationId: 'O1',
    })
  })
})
