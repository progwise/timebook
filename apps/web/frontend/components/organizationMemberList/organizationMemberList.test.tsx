import { render, screen } from '@testing-library/react'
import { cacheExchange, Client, fetchExchange, Provider } from 'urql'

import { makeFragmentData } from '../../generated/gql'
import { Role } from '../../generated/gql/graphql'
import { OrganizationMemberList, OrganizationMemberListOrganizationFragment } from './organizationMemberList'

const client = new Client({ url: '/api/graphql', exchanges: [cacheExchange, fetchExchange] })

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider value={client}>{children}</Provider>
)

jest.mock('next-auth/react', () => ({
  useSession: () => ({ status: 'authenticated', data: { user: { id: '1' } } }),
}))

const organizationMembers = [
  { id: '1', name: 'Admin of the organization', organizationRole: Role.Admin },
  { id: '2', name: 'Member of the organization', organizationRole: Role.Member },
]

const organization = makeFragmentData(
  {
    id: '1',
    title: 'Org 1',
    canModify: true,
    isOrganizationMember: true,
    organizationRole: Role.Admin,
    members: organizationMembers,
  },
  OrganizationMemberListOrganizationFragment,
)

describe('OrganizationMemberList', () => {
  it('should display a list of all organization members', async () => {
    render(<OrganizationMemberList organization={organization} />, { wrapper })

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(2)
    expect(rows[0]).toHaveTextContent('Admin of the organization')
    expect(rows[1]).toHaveTextContent('Member of the organization')
  })

  it('should display the correct role labels', async () => {
    render(<OrganizationMemberList organization={organization} />, { wrapper })

    const rows = screen.getAllByRole('row')
    expect(rows[0]).toHaveTextContent('Organization admin')
    expect(rows[1]).toHaveTextContent('Organization member')
  })

  it('should not display role change buttons if the current user is only an organization member', async () => {
    const organization = makeFragmentData(
      {
        id: '1',
        title: 'Org 1',
        canModify: false,
        isOrganizationMember: true,
        organizationRole: 'MEMBER',
        members: organizationMembers,
      },
      OrganizationMemberListOrganizationFragment,
    )

    render(<OrganizationMemberList organization={organization} />, { wrapper })
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
        members: [],
      },
      OrganizationMemberListOrganizationFragment,
    )

    render(<OrganizationMemberList organization={organization} />, { wrapper })
    const roleButtons = screen.queryByRole('button', { name: /Promote|Demote/ })

    expect(roleButtons).not.toBeInTheDocument()
  })

  it('should display role change buttons if the current user is an organization admin', async () => {
    render(<OrganizationMemberList organization={organization} />, { wrapper })
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
        organizationRole: 'MEMBER',
        members: organizationMembers,
      },
      OrganizationMemberListOrganizationFragment,
    )
    render(<OrganizationMemberList organization={organization} />, { wrapper })
    const removeButton = screen.queryByRole('button', {
      name: "Remove user from the organization and all of the organization's projects",
    })

    expect(removeButton).not.toBeInTheDocument()
  })
})
