import {
  mockProjectMembershipCreateMutation,
  mockProjectMembershipDeleteMutation,
  mockProjectsWithTasksQuery,
} from '../generated/graphql'
import { testProject1, testProject2 } from './testData'

export let assignedProjects = [testProject1, testProject2]

const allProjects = [testProject1, testProject2]

export const projectHandlers = [
  mockProjectsWithTasksQuery((request, response, context) => {
    const result = response(
      context.data({
        __typename: 'Query',
        teamBySlug: {
          __typename: 'Team',
          projects: [testProject1, testProject2],
        },
      }),
    )
    return result
  }),
  mockProjectMembershipDeleteMutation((request, response, context) => {
    assignedProjects = assignedProjects.filter((project) => project.id !== request.variables.projectID)

    const result = response(
      context.data({
        __typename: 'Mutation',
        projectMembershipDelete: {
          __typename: 'Project',
          title: assignedProjects.find((project) => project.id === request.variables.projectID)?.title ?? '',
          members: [],
        },
      }),
    )
    return result
  }),
  mockProjectMembershipCreateMutation((request, response, context) => {
    const addProject = allProjects.find((project) => project.id === request.variables.projectID)

    if (addProject) assignedProjects.push(addProject)

    const result = response(
      context.data({
        __typename: 'Mutation',
        projectMembershipCreate: {
          __typename: 'Project',
          title: assignedProjects.find((project) => project.id === request.variables.projectID)?.title ?? '',
          members: [{ __typename: 'User', name: 'Team Member' }],
        },
      }),
    )
    return result
  }),
]
