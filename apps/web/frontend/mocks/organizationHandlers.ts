import {
  mockMyOrganizationsQuery,
  mockOrganizationMembershipDeleteMutation,
  mockOrganizationMembershipUpdateMutation,
  mockOrganizationQuery,
  OrganizationMemberListOrganizationFragment,
  Role,
} from './mocks.generated'

const testOrganization1 = {
  id: 'organization1',
  title: 'Organization 1',
  isArchived: false,
  members: [{ id: '1', image: undefined }],
}
const testOrganization2 = {
  id: 'organization2',
  title: 'Organization 2',
  isArchived: false,
  members: [{ id: '2', image: undefined }],
}

let members: OrganizationMemberListOrganizationFragment['members'] = [
  {
    id: '1',
    name: 'Admin of the organization',
    organizationRole: Role.Admin,
    image: undefined,
    __typename: 'User',
  },
  {
    id: '2',
    name: ' Member of the organization',
    organizationRole: Role.Member,
    image: undefined,
    __typename: 'User',
  },
]

export const organizationHandlers = [
  mockOrganizationQuery((_request, response, context) => {
    const result = response(
      context.data({
        __typename: 'Query',
        organization: {
          id: '1',
          canModify: true,
          projects: [],
          title: 'Member',
          isArchived: false,
          members,
          invoices: [],
          __typename: 'Organization',
        },
      }),
    )
    return result
  }),
  mockOrganizationMembershipUpdateMutation((request, response, context) => {
    const member = members.find((member) => member.id === request.variables.userId)
    if (member) {
      member.organizationRole = request.variables.organizationRole
    }
    const result = response(
      context.data({
        __typename: 'Mutation',
        organizationMembershipCreate: {
          id: '1',
          __typename: 'Organization',
        },
      }),
    )
    return result
  }),
  mockOrganizationMembershipDeleteMutation((request, response, context) => {
    members = members.filter((member) => member.id !== request.variables.userId)
    const result = response(
      context.data({
        __typename: 'Mutation',
        organizationMembershipDelete: {
          __typename: 'Organization',
          id: '1',
        },
      }),
    )
    return result
  }),
  mockMyOrganizationsQuery((_request, response, context) => {
    const result = response(
      context.data({
        __typename: 'Query',
        organizations: [testOrganization1, testOrganization2],
      }),
    )
    return result
  }),
]
