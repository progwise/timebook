import {
  ProjectMemberListProjectFragment,
  Role,
  mockMyProjectsQuery,
  mockProjectMembershipDeleteMutation,
  mockProjectMembershipUpdateMutation,
  mockProjectQuery,
  mockWeekTableQuery,
} from './mocks.generated'

const testProject1 = { id: 'project1', title: 'Project 1', isArchived: false }
const testProject2 = { id: 'project2', title: 'Project 2', isArchived: false }

let members: ProjectMemberListProjectFragment['members'] = [
  {
    id: '1',
    name: 'Admin of the project',
    role: Role.Admin,
    __typename: 'User',
  },
  {
    id: '2',
    name: ' Member of the project',
    role: Role.Member,
    __typename: 'User',
  },
]
export const projectHandlers = [
  mockProjectQuery((_request, response, context) => {
    const result = response(
      context.data({
        __typename: 'Query',
        project: {
          id: '1',
          canModify: true,
          tasks: [],
          title: 'Member',
          startDate: undefined,
          endDate: undefined,
          hasWorkHours: false,
          isArchived: false,
          inviteKey: '2',
          members,
          __typename: 'Project',
        },
      }),
    )
    return result
  }),
  mockProjectMembershipUpdateMutation((request, response, context) => {
    const member = members.find((member) => member.id === request.variables.userId)
    if (member) {
      member.role = request.variables.role
    }
    const result = response(
      context.data({
        __typename: 'Mutation',
        projectMembershipCreate: {
          __typename: 'Project',
          id: '1',
        },
      }),
    )
    return result
  }),
  mockProjectMembershipDeleteMutation((request, response, context) => {
    members = members.filter((member) => member.id !== request.variables.userId)
    const result = response(
      context.data({
        __typename: 'Mutation',
        projectMembershipDelete: {
          __typename: 'Project',
          id: '1',
        },
      }),
    )
    return result
  }),
  mockMyProjectsQuery((request, response, context) => {
    const result = response(
      context.data({
        __typename: 'Query',
        projects: [testProject1, testProject2],
      }),
    )
    return result
  }),
  mockWeekTableQuery((_request, response, context) =>
    response(
      context.data({
        __typename: 'Query',
        projects: [
          {
            ...testProject1,
            tasks: [
              {
                id: 'task1',
                title: 'Task 1',
                workHours: [],
                project: { id: testProject1.id, isProjectMember: true, isArchived: false },
                isLocked: false,
                isLockedByUser: false,
                isLockedByAdmin: false,
              },
            ],
          },
          { ...testProject2, tasks: [] },
        ],
      }),
    ),
  ),
]
