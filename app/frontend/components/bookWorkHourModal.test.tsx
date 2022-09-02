import { vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { Client, Provider } from 'urql'
import { BookWorkHourModal, WorkHourItem } from './bookWorkHourModal'
import '../mocks/mockServer'
import userEvent from '@testing-library/user-event'

const client = new Client({ url: '/api/graphql' })
const wrapper: React.FC = ({ children }) => <Provider value={client}>{children}</Provider>

describe('BookWorkHourModal', () => {
  const testItem: WorkHourItem = {
    date: new Date(),
    duration: 0,
    projectId: '',
    taskId: '',
  }
  const onCloseMock = vi.fn()

  it('should render the project selection', async () => {
    render(<BookWorkHourModal workHourItem={testItem} onClose={onCloseMock} />, { wrapper })
    const projectsCombo = await screen.findByRole('combobox', { name: /project/i })
    expect(projectsCombo).toBeInTheDocument()
    const projectSelectOption = await within(projectsCombo).findByRole('option', { name: /please select/i })
    expect(projectSelectOption).toBeInTheDocument()
  })
  it('should render the projects', async () => {
    render(<BookWorkHourModal workHourItem={testItem} onClose={onCloseMock} />, { wrapper })
    const projectsCombo = await screen.findByRole('combobox', { name: /project/i })
    expect(projectsCombo).toBeInTheDocument()
    const projectOptions = await within(projectsCombo).findAllByRole('option', { name: /project/i })
    expect(projectOptions.length).toBeGreaterThan(1)
  })

  it('can select a project and see its tasks', async () => {
    render(<BookWorkHourModal workHourItem={testItem} onClose={onCloseMock} />, { wrapper })
    const projectsCombo = screen.getByRole('combobox', { name: /project/i })
    const projectOption = await screen.findByRole('option', { name: /project 1/i })
    await userEvent.selectOptions(projectsCombo, ['project1'])
    expect((projectOption as HTMLOptionElement).selected).toBe(true)
    const taskOption = await screen.findByRole('option', { name: /task 1/i })
    expect(taskOption).toBeInTheDocument()
  })
})
