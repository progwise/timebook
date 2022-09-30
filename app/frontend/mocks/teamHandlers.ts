import {
  mockTeamArchiveMutation,
  mockTeamUnarchiveMutation,
  mockMeQuery,
  mockTeamProjectsQuery,
  mockTeamQuery,
  mockTeamsQuery,
  mockTeamsWithProjectsQuery,
  mockUserQuery,
  mockUserRoleUpdateMutation,
  Role,
  TeamFragment,
  Theme,
  mockUserCapacityUpdateMutation,
} from '../generated/graphql'
import { assignedProjects } from './projectHandlers'
import { testProject1, testProject2 } from './testData'

const testTeam1: TeamFragment = {
  __typename: 'Team',
  id: 'okay',
  inviteKey: 'inviteKey',
  slug: 'team1',
  theme: Theme.Blue,
  title: 'testTeam1',
  archived: false,
}
const testTeam2: TeamFragment = {
  __typename: 'Team',
  id: 'okay2',
  inviteKey: 'inviteKey2',
  slug: 'team2',
  theme: Theme.Red,
  title: 'testTeam2',
  archived: false,
}

export const teamHandlers = [
  mockTeamsQuery((request, response, context) => {
    const result = response(
      context.data({
        __typename: 'Query',
        teams: [testTeam1, testTeam2],
      }),
    )
    return result
  }),
  mockTeamQuery((request, response, context) => {
    const result = response(
      context.data({
        __typename: 'Query',
        team: { ...testTeam1, members: [], canModify: true },
      }),
    )
    return result
  }),
  mockTeamsWithProjectsQuery((request, response, context) => {
    const result = response(
      context.data({
        __typename: 'Query',
        teams: [{ ...testTeam1, projects: [testProject1, testProject2] }],
      }),
    )
    return result
  }),
  mockTeamProjectsQuery((request, response, context) => {
    const result = response(
      context.data({
        __typename: 'Query',
        projects: [testProject1, testProject2],
      }),
    )
    return result
  }),
  mockMeQuery((request, response, context) => {
    const result = response(
      context.data({
        __typename: 'Query',
        user: {
          __typename: 'User',
          id: '',
          image: undefined,
          name: 'Admin',
          role: Role.Admin,
          projects: assignedProjects,
        },
      }),
    )
    return result
  }),
  mockUserQuery((request, response, context) => {
    const result = response(
      context.data({
        __typename: 'Query',
        user: {
          __typename: 'User',
          id: '23182391283',
          name: 'Test Member',
          image: undefined,
          role: Role.Admin,
          projects: assignedProjects,
        },
      }),
    )
    return result
  }),
  mockUserRoleUpdateMutation((request, response, context) => {
    const result = response(
      context.data({
        __typename: 'Mutation',
        userRoleUpdate: {
          __typename: 'User',
          id: '123123-asd-12323',
          role: Role.Admin,
        },
      }),
    )
    return result
  }),
  mockTeamArchiveMutation((request, response, context) => {
    testTeam1.archived = true
    const result = response(
      context.data({
        __typename: 'Mutation',
        teamArchive: testTeam1,
      }),
    )
    return result
  }),
  mockTeamUnarchiveMutation((request, response, context) => {
    testTeam1.archived = false
    const result = response(
      context.data({
        __typename: 'Mutation',
        teamUnarchive: testTeam1,
      }),
    )
    return result
  }),
  mockUserCapacityUpdateMutation((request, response, context) => {
    testTeam1.archived = false
    const result = response(
      context.data({
        __typename: 'Mutation',
        userCapacityUpdate: {
          __typename: 'User',
          id: '123123',
          capacityMinutes: 1231,
        },
      }),
    )
    return result
  }),
]
