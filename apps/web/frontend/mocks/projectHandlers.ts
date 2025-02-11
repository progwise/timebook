import { eachDayOfInterval, isSameMonth } from 'date-fns'

import {
  ProjectMemberListProjectFragment,
  Role,
  mockMyProjectsMembersQuery,
  mockMyProjectsQuery,
  mockProjectMembershipDeleteMutation,
  mockProjectMembershipUpdateMutation,
  mockProjectQuery,
  mockWeekGridQuery,
} from './mocks.generated'

let members: ProjectMemberListProjectFragment['members'] = [
  {
    id: '1',
    name: 'Admin of the project',
    projectRole: Role.Admin,
    image: undefined,
    __typename: 'User',
  },
  {
    id: '2',
    name: ' Member of the project',
    projectRole: Role.Member,
    image: undefined,
    __typename: 'User',
  },
]

const testProject1 = {
  id: 'project1',
  title: 'Project 1',
  canModify: true,
  isArchived: false,
  members,
}
const testProject2 = {
  id: 'project2',
  title: 'Project 2',
  canModify: false,
  isArchived: false,
  members,
}

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
          members,
          __typename: 'Project',
        },
        organizations: [],
      }),
    )
    return result
  }),
  mockProjectMembershipUpdateMutation((request, response, context) => {
    const member = members.find((member) => member.id === request.variables.userId)
    if (member) {
      member.projectRole = request.variables.projectRole
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
  mockMyProjectsQuery((_request, response, context) => {
    const result = response(
      context.data({
        __typename: 'Query',
        projects: [testProject1, testProject2],
      }),
    )
    return result
  }),
  mockMyProjectsMembersQuery((_request, response, context) => {
    const result = response(
      context.data({
        __typename: 'Query',
        myProjectsMembers: members,
        user: { id: '1', __typename: 'User' },
      }),
    )
    return result
  }),
  mockWeekGridQuery((request, response, context) =>
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
                project: { id: testProject1.id, canModify: true, isArchived: false, members },
                isLocked: false,
                isLockedByAdmin: false,
                tracking: undefined,
                projectTotal: [],
                footerTotal: [],
                taskTotal: eachDayOfInterval({
                  start: new Date(request.variables.from),
                  end: new Date(request.variables.to ?? request.variables.from),
                }).map((date) => ({
                  __typename: 'WorkHourOfDay',
                  date: date.toISOString(),
                  isLocked: isSameMonth(date, new Date('2023-02-01')), // lock all days in February 2023
                  user: members[0],
                  workHour: { __typename: 'WorkHour', duration: 0 },
                })),
                workHourOfDays: eachDayOfInterval({
                  start: new Date(request.variables.from),
                  end: new Date(request.variables.to ?? request.variables.from),
                }).map((date) => ({
                  __typename: 'WorkHourOfDay',
                  date: date.toISOString(),
                  isLocked: isSameMonth(date, new Date('2023-02-01')), // lock all days in February 2023
                  user: members[0],
                  workHour: { __typename: 'WorkHour', duration: 0 },
                })),
              },
            ],
          },
          { ...testProject2, tasks: [] },
        ],
      }),
    ),
  ),
]
