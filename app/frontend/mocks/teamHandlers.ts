import { mockTeamQuery, mockTeamsQuery, mockTeamsWithProjectsQuery, TeamFragment, Theme } from '../generated/graphql'
import { testProject1, testProject2 } from './testData'

const testTeam1: TeamFragment = {
  __typename: 'Team',
  id: 'okay',
  inviteKey: 'inviteKey',
  slug: 'team1',
  theme: Theme.Blue,
  title: 'testTeam1',
}
const testTeam2: TeamFragment = {
  __typename: 'Team',
  id: 'okay2',
  inviteKey: 'inviteKey2',
  slug: 'team2',
  theme: Theme.Red,
  title: 'testTeam2',
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
]
