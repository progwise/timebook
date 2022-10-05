import {
  mockTeamQuery,
  mockTeamsQuery,
  mockTeamsWithProjectsQuery,
  mockTeamArchiveMutation,
  TeamFragment,
  Theme,
  mockTeamUnarchiveMutation,
} from '../generated/graphql'
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
]
