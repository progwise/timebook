import { render, screen } from '@testing-library/react'
import { cacheExchange, Client, fetchExchange, Provider } from 'urql'

import { makeFragmentData } from '../../generated/gql'
import { Role } from '../../generated/gql/graphql'
import { ProjectMemberList, ProjectMemberListProjectFragment } from './projectMemberList'

const client = new Client({ url: '/api/graphql', exchanges: [cacheExchange, fetchExchange] })

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
    projectRole: Role.Admin,
  },
  {
    id: '2',
    name: 'Member of the project',
    projectRole: Role.Member,
  },
]
const project = makeFragmentData(
  {
    id: '1',
    title: 'Project 1',
    canModify: true,
    isProjectMember: true,
    projectRole: 'ADMIN',
    members,
  },
  ProjectMemberListProjectFragment,
)

describe('ProjectMemberList', () => {
  it('should display a list of members', async () => {
    render(<ProjectMemberList project={project} />, { wrapper })

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(2)
    expect(rows[0]).toHaveTextContent('Admin of the project')
    expect(rows[1]).toHaveTextContent('Member of the project')
  })

  it('should display the correct role labels', async () => {
    render(<ProjectMemberList project={project} />, { wrapper })

    const rows = screen.getAllByRole('row')
    expect(rows[0]).toHaveTextContent('Admin')
    expect(rows[1]).toHaveTextContent('Member')
  })

  it('should not display role change buttons if the current user is only a member', async () => {
    const project = makeFragmentData(
      {
        id: '1',
        title: 'Project 1',
        canModify: false,
        isProjectMember: true,
        projectRole: 'MEMBER',
        members,
      },
      ProjectMemberListProjectFragment,
    )
    render(<ProjectMemberList project={project} />, { wrapper })
    const roleButtons = screen.queryByRole('button', { name: /Promote|Demote/ })

    expect(roleButtons).not.toBeInTheDocument()
  })

  it('should display role change buttons for admins', async () => {
    render(<ProjectMemberList project={project} />, { wrapper })
    const promoteButton = screen.queryByRole('button', { name: 'Promote' })
    const demoteButton = screen.queryByRole('button', { name: 'Demote' })

    expect(promoteButton).toBeInTheDocument()
    expect(demoteButton).not.toBeInTheDocument()
  })

  it('should not display a "Remove" button for members', async () => {
    const project = makeFragmentData(
      {
        id: '1',
        title: 'Project 1',
        canModify: false,
        isProjectMember: true,
        projectRole: 'MEMBER',
        members,
      },
      ProjectMemberListProjectFragment,
    )
    render(<ProjectMemberList project={project} />, { wrapper })
    const removeButton = screen.queryByRole('button', { name: 'Remove user from project' })

    expect(removeButton).not.toBeInTheDocument()
  })
})
