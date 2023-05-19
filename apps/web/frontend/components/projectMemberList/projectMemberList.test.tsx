import { render, screen, within } from '@testing-library/react'
import { Client, Provider } from 'urql'

import { makeFragmentData } from '../../generated/gql'
import { Role } from '../../generated/gql/graphql'
import { ProjectMemberList, ProjectMemberListProjectFragment } from './projectMemberList'

const client = new Client({ url: '/api/graphql' })

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider value={client}>{children}</Provider>
)

jest.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'authenticated', data: { user: { id: '1' } } }),
}))

const members = [
  {
    id: '1',
    name: 'Admin of the project',
    role: Role.Admin,
  },
  {
    id: '2',
    name: 'Member of the project',
    role: Role.Member,
  },
]
const project = makeFragmentData(
  {
    id: '1',
    title: 'Project 1',
    canModify: true,
    isProjectMember: true,
    role: 'ADMIN',
    members,
  },
  ProjectMemberListProjectFragment,
)

describe('ProjectMemberList', () => {
  it('should display a list of members', async () => {
    render(<ProjectMemberList project={project} />, { wrapper })

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(3)
    expect(rows[1]).toHaveTextContent('Admin of the project')
    expect(rows[2]).toHaveTextContent('Member of the project')
  })

  it('should display the correct role labels', async () => {
    render(<ProjectMemberList project={project} />, { wrapper })

    const rows = screen.getAllByRole('row')
    within(rows[1]).getByRole('cell', { name: 'Admin' })
    within(rows[2]).getByRole('cell', { name: 'Member' })
  })

  it('should not display role change buttons if the current user is only a member', async () => {
    const project = makeFragmentData(
      {
        id: '1',
        title: 'Project 1',
        canModify: false,
        isProjectMember: true,
        role: 'MEMBER',
        members,
      },
      ProjectMemberListProjectFragment,
    )
    render(<ProjectMemberList project={project} />, { wrapper })
    const roleButtons = screen.queryAllByRole('button', { name: /Promote|Demote/ })

    expect(roleButtons).toHaveLength(0)
  })

  it('should display role change buttons for admins', async () => {
    render(<ProjectMemberList project={project} />, { wrapper })
    const promoteButton = screen.queryAllByRole('button', { name: 'Promote' })
    const demoteButton = screen.queryAllByRole('button', { name: 'Demote' })

    expect(promoteButton).toHaveLength(1)
    expect(demoteButton).toHaveLength(0)
  })

  it('should not display a "Remove" button for members', async () => {
    const project = makeFragmentData(
      {
        id: '1',
        title: 'Project 1',
        canModify: false,
        isProjectMember: true,
        role: 'MEMBER',
        members,
      },
      ProjectMemberListProjectFragment,
    )
    render(<ProjectMemberList project={project} />, { wrapper })
    const removeButton = screen.queryByRole('button', { name: 'Remove user from project' })

    expect(removeButton).toBeNull()
  })
})
