import { mockTeamCreateMutation, mockTeamUpdateMutation, Theme } from '../generated/graphql'

export const handlers = [
  mockTeamCreateMutation((request, response, context) =>
    response(
      context.data({
        __typename: 'Mutation',
        teamCreate: {
          id: 'ckyh7xze0000209lb4ijfbncn',
          canModify: true,
          inviteKey: 'ckyh7yr2k000409lb3rxj3v4t',
          slug: request.variables.data.slug,
          theme: Theme.Blue,
          title: request.variables.data.title,
          __typename: 'Team',
        },
      }),
    ),
  ),
  mockTeamUpdateMutation((request, response, context) =>
    response(
      context.data({
        teamUpdate: {
          id: request.variables.id,
          canModify: true,
          inviteKey: '',
          slug: request.variables.data.slug,
          title: request.variables.data.title,
          theme: request.variables.data.theme ?? Theme.Blue,
          __typename: 'Team',
        },
        __typename: 'Mutation',
      }),
    ),
  ),
]
