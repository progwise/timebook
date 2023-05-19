import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Client, Provider } from 'urql'

import { makeFragmentData } from '../../generated/gql'
import { Role } from '../../generated/gql/graphql'
import '../../mocks/mockServer'
import { ProjectMemberList, ProjectMemberListProjectFragment } from './projectMemberList'

const client = new Client({ url: '/api/graphql' })

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider value={client}>{children}</Provider>
)

jest.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'authenticated', data: { user: { id: '1' } } }),
}))

const project = makeFragmentData(
  {
    id: '1',
    title: 'Project 1',
    canModify: true,
    isProjectMember: true,
    role: 'ADMIN',
    members: [
      {
        id: '1',
        name: 'Administrator of the project',
        role: Role.Admin,
      },
      {
        id: '2',
        name: 'Non administrator of the project',
        role: Role.Member,
      },
    ],
  },
  ProjectMemberListProjectFragment,
)

describe('ProjectMemberList', () => {
  it('should display a list of members', async () => {
    render(<ProjectMemberList project={project} />, { wrapper })

    const memberNames = await screen.findAllByText(/Admin of the project|Member of the project/)
    expect(memberNames).toHaveLength(2)
  })

  it('should display the correct role labels', async () => {
    render(<ProjectMemberList project={project} />, { wrapper })
    const roleLabels = await screen.findAllByText(/Admin|Member/)

    expect(roleLabels).toHaveLength(2)
  })

  it('should not display role change buttons if the current user is only a member', async () => {
    render(<ProjectMemberList project={project} />, { wrapper })
    const roleButtons = await screen.findAllByRole('button', { name: /Promote|Demote/ })

    expect(roleButtons).not.toBeInTheDocument()
  })

  it('should display role change buttons for admins', async () => {
    render(<ProjectMemberList project={project} />, { wrapper })
    const roleButtons = await screen.findAllByRole('button', { name: /Promote|Demote/ })

    expect(roleButtons).toBeInTheDocument()
  })

  it('should promote project membership of a member', async () => {
    render(<ProjectMemberList project={project} />, { wrapper })
    const promoteButton = screen.getByRole('button', { name: 'Promote' })
    expect(promoteButton).toBeInTheDocument()
    await userEvent.click(promoteButton)

    await waitFor(() => expect(promoteButton).not.toBeInTheDocument())
  })

  it('should demote project membership of an admin', async () => {
    render(<ProjectMemberList project={project} />, { wrapper })
    const demoteButton = screen.getByRole('button', { name: 'Demote' })
    expect(demoteButton).toBeInTheDocument()
    await userEvent.click(demoteButton)

    await waitFor(() => expect(project).toHaveBeenCalledTimes(1))
    expect(project).toHaveBeenCalledWith({
      projectId: '1',
      userId: '1',
      role: Role.Member,
    })
  })

  it('should display a "Remove" button for admins', async () => {
    render(<ProjectMemberList project={project} />, { wrapper })
    const removeButton = screen.getByRole('tooltip', { name: 'Remove user from project' })
    expect(removeButton).toBeInTheDocument()

    await userEvent.click(removeButton)

    const confirmRemoveButton = screen.getByRole('button', { name: 'Remove' })
    await userEvent.click(confirmRemoveButton)

    await waitFor(() => expect(confirmRemoveButton).not.toBeInTheDocument())
  })

  it('should not display a "Remove" button for members', async () => {
    render(<ProjectMemberList project={project} />, { wrapper })
    const removeButton = screen.getByRole('tooltip', { name: 'Remove user from project' })
    expect(removeButton).not.toBeInTheDocument()
  })
})
