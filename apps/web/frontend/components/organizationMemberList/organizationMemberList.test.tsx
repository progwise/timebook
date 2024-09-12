import { render, screen } from '@testing-library/react'
import { Client, Provider } from 'urql'

import { makeFragmentData } from '../../generated/gql'
import { Role } from '../../generated/gql/graphql'
import {
  OrganizationMemberList,
  OrganizationMemberListOrganizationFragment,
  OrganizationProjectMemberListProjectFragment,
} from './organizationMemberList'

const client = new Client({ url: '/api/graphql' })

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider value={client}>{children}</Provider>
)

jest.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'authenticated', data: { user: { id: '1' } } }),
}))

const organizationMembers = [
  { id: '1', name: 'Admin of the organization', role: Role.Admin },
  { id: '2', name: 'Member of the organization', role: Role.Member },
]

const projectMembers = [{ id: '3', name: 'Project member', role: Role.Member }]

const organization = makeFragmentData(
  {
    id: '1',
    title: 'Org 1',
    canModify: true,
    isOrganizationMember: true,
    role: 'ADMIN',
    members: organizationMembers,
  },
  OrganizationMemberListOrganizationFragment,
)

const projects = [
  makeFragmentData(
    {
      id: '1',
      title: 'Project 1',
      canModify: true,
      isProjectMember: true,
      role: 'ADMIN',
      members: projectMembers,
    },
    OrganizationProjectMemberListProjectFragment,
  ),
]

describe('OrganizationMemberList', () => {
  it('should display a list of all organization members', async () => {
    render(<OrganizationMemberList organization={organization} projects={projects} />, { wrapper })

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(3)
    expect(rows[0]).toHaveTextContent('Admin of the organization')
    expect(rows[1]).toHaveTextContent('Member of the organization')
    expect(rows[2]).toHaveTextContent('Project member')
  })

  it('should display the correct role labels', async () => {
    render(<OrganizationMemberList organization={organization} projects={projects} />, { wrapper })

    const rows = screen.getAllByRole('row')
    expect(rows[0]).toHaveTextContent('Organization admin')
    expect(rows[1]).toHaveTextContent('Organization member')
    expect(rows[2]).toHaveTextContent('Project member')
  })

  it('should not display role change buttons if the current user is only an organization member', async () => {
    const organization = makeFragmentData(
      {
        id: '1',
        title: 'Org 1',
        canModify: false,
        isOrganizationMember: true,
        role: 'MEMBER',
        members: organizationMembers,
      },
      OrganizationMemberListOrganizationFragment,
    )

    render(<OrganizationMemberList organization={organization} projects={projects} />, { wrapper })
    const roleButtons = screen.queryByRole('button', { name: /Promote|Demote/ })

    expect(roleButtons).not.toBeInTheDocument()
  })

  it('should not display role change buttons if the current user is only a project member', async () => {
    const organization = makeFragmentData(
      {
        id: '1',
        title: 'Org 1',
        canModify: false,
        isOrganizationMember: false,
        // role: 'MEMBER',
        members: [],
      },
      OrganizationMemberListOrganizationFragment,
    )

    render(<OrganizationMemberList organization={organization} projects={projects} />, { wrapper })
    const roleButtons = screen.queryByRole('button', { name: /Promote|Demote/ })

    expect(roleButtons).not.toBeInTheDocument()
  })

  it('should display role change buttons if the current user is an organization admin', async () => {
    render(<OrganizationMemberList organization={organization} projects={projects} />, { wrapper })
    const promoteButton = screen.queryByRole('button', { name: 'Promote' })
    const demoteButton = screen.queryByRole('button', { name: 'Demote' })

    expect(promoteButton).toBeInTheDocument()
    expect(demoteButton).not.toBeInTheDocument()
  })

  it('should not display a "Remove" button for non-admins', async () => {
    const organization = makeFragmentData(
      {
        id: '1',
        title: 'Org 1',
        canModify: false,
        isOrganizationMember: true,
        role: 'MEMBER',
        members: organizationMembers,
      },
      OrganizationMemberListOrganizationFragment,
    )
    render(<OrganizationMemberList organization={organization} projects={projects} />, { wrapper })
    const removeButton = screen.queryByRole('button', { name: 'Remove user from the organization' })

    expect(removeButton).not.toBeInTheDocument()
  })
})
