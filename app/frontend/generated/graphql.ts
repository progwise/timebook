/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
import gql from 'graphql-tag'
import * as Urql from 'urql'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: string
  /** A time string at UTC, such as 10:15:30Z, compliant with the `full-time` format outlined in section 5.6 of the RFC 3339profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Time: string
}

export type Customer = {
  __typename?: 'Customer'
  /** Identifier of the customer */
  id: Scalars['ID']
  /** Title of the customer */
  title: Scalars['String']
}

export type CustomerInput = {
  /** Title of the customer */
  title: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  /** Create a new WorkHour */
  createWorkHour: WorkHour
  /** Create a new customer for a team */
  customerCreate: Customer
  /** Delete a customer */
  customerDelete: Customer
  /** Update a customer */
  customerUpdate: Customer
  /** Create a new project */
  projectCreate: Project
  /** Delete a project */
  projectDelete: Project
  /** Update a project */
  projectUpdate: Project
  /** Create a new Task */
  taskCreate: Task
  /** Delete a task */
  taskDelete: Task
  /** Accept an invite to a team */
  teamAcceptInvite: Team
  /** Create a new team */
  teamCreate: Team
  /** Delete a new team */
  teamDelete: Team
  /** Update a new team */
  teamUpdate: Team
}

export type MutationCreateWorkHourArgs = {
  comment?: InputMaybe<Scalars['String']>
  date: Scalars['Date']
  duration: Scalars['Int']
  taskId: Scalars['ID']
}

export type MutationCustomerCreateArgs = {
  data: CustomerInput
  teamId: Scalars['ID']
}

export type MutationCustomerDeleteArgs = {
  customerId: Scalars['ID']
}

export type MutationCustomerUpdateArgs = {
  customerId: Scalars['ID']
  data: CustomerInput
}

export type MutationProjectCreateArgs = {
  data: ProjectInput
}

export type MutationProjectDeleteArgs = {
  id: Scalars['ID']
}

export type MutationProjectUpdateArgs = {
  data: ProjectInput
  id: Scalars['ID']
}

export type MutationTaskCreateArgs = {
  data: TaskInput
}

export type MutationTaskDeleteArgs = {
  id: Scalars['ID']
}

export type MutationTeamAcceptInviteArgs = {
  inviteKey: Scalars['String']
}

export type MutationTeamCreateArgs = {
  data: TeamInput
}

export type MutationTeamDeleteArgs = {
  id: Scalars['ID']
}

export type MutationTeamUpdateArgs = {
  data: TeamInput
  id: Scalars['ID']
}

export type Project = {
  __typename?: 'Project'
  endDate?: Maybe<Scalars['Date']>
  /** identifies the project */
  id: Scalars['ID']
  startDate?: Maybe<Scalars['Date']>
  tasks: Array<Task>
  title: Scalars['String']
  workHours: Array<WorkHour>
}

export type ProjectInput = {
  end?: InputMaybe<Scalars['Date']>
  start?: InputMaybe<Scalars['Date']>
  title: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  /** Returns a single customer */
  customer: Customer
  /** Returns a single project */
  project: Project
  /** Returns a list of all projects */
  projects: Array<Project>
  /** Return a team by an id */
  team: Team
  /** Return a team by a slug */
  teamBySlug: Team
  /** Return all teams */
  teams: Array<Team>
  /** Returns a single user */
  user: User
  /** @deprecated Use members field on team type instead */
  users: Array<User>
}

export type QueryCustomerArgs = {
  customerId: Scalars['ID']
}

export type QueryProjectArgs = {
  projectId: Scalars['ID']
}

export type QueryTeamArgs = {
  id: Scalars['ID']
}

export type QueryTeamBySlugArgs = {
  slug: Scalars['String']
}

export type QueryUserArgs = {
  userId: Scalars['ID']
}

export type Task = {
  __typename?: 'Task'
  /** Identifies the task */
  id: Scalars['ID']
  project: Project
  /** The user can identify the task in the UI */
  title: Scalars['String']
  workhours: Array<WorkHour>
}

export type TaskInput = {
  projectId: Scalars['Int']
  title: Scalars['String']
}

export type Team = {
  __typename?: 'Team'
  /** List of all customers of the team */
  customers: Array<Customer>
  /** Identifier of the team */
  id: Scalars['ID']
  inviteKey: Scalars['String']
  /** All members of the team */
  members: Array<User>
  /** Slug that is used in the team URL */
  slug: Scalars['String']
  /** Color theme of the team */
  theme: Theme
  /** Title of the team */
  title: Scalars['String']
}

export type TeamInput = {
  /** Slug that is used in the team URL */
  slug: Scalars['String']
  /** Color theme of the team */
  theme?: InputMaybe<Theme>
  /** Title of the team */
  title: Scalars['String']
}

export enum Theme {
  Blue = 'BLUE',
  Gray = 'GRAY',
  Green = 'GREEN',
  Indigo = 'INDIGO',
  Pink = 'PINK',
  Purple = 'PURPLE',
  Red = 'RED',
  Yellow = 'YELLOW',
}

export type User = {
  __typename?: 'User'
  id: Scalars['ID']
  image?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
}

export type WorkHour = {
  __typename?: 'WorkHour'
  comment?: Maybe<Scalars['String']>
  date: Scalars['Date']
  /** Duration of the work hour in minutes */
  duration: Scalars['Int']
  /** Identifies the work hour */
  id: Scalars['ID']
  project: Project
  /** Task for which the working hour was booked */
  task: Task
}

export type CreateWorkHourMutationVariables = Exact<{
  duration: Scalars['Int']
  taskId: Scalars['ID']
  date: Scalars['Date']
  comment?: InputMaybe<Scalars['String']>
}>

export type CreateWorkHourMutation = {
  __typename?: 'Mutation'
  createWorkHour: {
    __typename?: 'WorkHour'
    id: string
    comment?: string | null | undefined
    date: string
    duration: number
    project: {
      __typename?: 'Project'
      id: string
      title: string
      startDate?: string | null | undefined
      endDate?: string | null | undefined
    }
  }
}

export type ProjectQueryVariables = Exact<{
  projectId: Scalars['ID']
}>

export type ProjectQuery = {
  __typename?: 'Query'
  project: {
    __typename?: 'Project'
    id: string
    title: string
    startDate?: string | null | undefined
    endDate?: string | null | undefined
    tasks: Array<{ __typename?: 'Task'; id: string; title: string }>
  }
}

export type TaskFragment = { __typename?: 'Task'; id: string; title: string }

export type ProjectsQueryVariables = Exact<{ [key: string]: never }>

export type ProjectsQuery = {
  __typename?: 'Query'
  projects: Array<{
    __typename?: 'Project'
    id: string
    title: string
    startDate?: string | null | undefined
    endDate?: string | null | undefined
    tasks: Array<{ __typename?: 'Task'; id: string; title: string }>
  }>
}

export type ProjectFragment = {
  __typename?: 'Project'
  id: string
  title: string
  startDate?: string | null | undefined
  endDate?: string | null | undefined
  tasks: Array<{ __typename?: 'Task'; id: string; title: string }>
}

export type ProjectCreateMutationVariables = Exact<{
  data: ProjectInput
}>

export type ProjectCreateMutation = {
  __typename?: 'Mutation'
  projectCreate: {
    __typename?: 'Project'
    id: string
    title: string
    startDate?: string | null | undefined
    endDate?: string | null | undefined
    tasks: Array<{ __typename?: 'Task'; id: string; title: string }>
  }
}

export type ProjectDeleteMutationVariables = Exact<{
  id: Scalars['ID']
}>

export type ProjectDeleteMutation = {
  __typename?: 'Mutation'
  projectDelete: {
    __typename?: 'Project'
    id: string
    title: string
    startDate?: string | null | undefined
    endDate?: string | null | undefined
    tasks: Array<{ __typename?: 'Task'; id: string; title: string }>
  }
}

export type ProjectUpdateMutationVariables = Exact<{
  id: Scalars['ID']
  data: ProjectInput
}>

export type ProjectUpdateMutation = {
  __typename?: 'Mutation'
  projectUpdate: {
    __typename?: 'Project'
    id: string
    title: string
    startDate?: string | null | undefined
    endDate?: string | null | undefined
    tasks: Array<{ __typename?: 'Task'; id: string; title: string }>
  }
}

export type TaskCreateMutationVariables = Exact<{
  data: TaskInput
}>

export type TaskCreateMutation = {
  __typename?: 'Mutation'
  taskCreate: { __typename?: 'Task'; id: string; title: string }
}

export type TaskDeleteMutationVariables = Exact<{
  id: Scalars['ID']
}>

export type TaskDeleteMutation = {
  __typename?: 'Mutation'
  taskDelete: { __typename?: 'Task'; id: string; title: string }
}

export type UsersQueryVariables = Exact<{ [key: string]: never }>

export type UsersQuery = {
  __typename?: 'Query'
  users: Array<{ __typename?: 'User'; id: string; name?: string | null | undefined; image?: string | null | undefined }>
}

export type UserFragment = {
  __typename?: 'User'
  id: string
  name?: string | null | undefined
  image?: string | null | undefined
}

export type TeamAcceptInviteMutationVariables = Exact<{
  inviteKey: Scalars['String']
}>

export type TeamAcceptInviteMutation = {
  __typename?: 'Mutation'
  teamAcceptInvite: {
    __typename?: 'Team'
    id: string
    title: string
    slug: string
    theme: Theme
    inviteKey: string
    members: Array<{ __typename?: 'User'; id: string; name?: string | null | undefined }>
  }
}

export const TaskFragmentDoc = gql`
  fragment Task on Task {
    id
    title
  }
`
export const ProjectFragmentDoc = gql`
  fragment Project on Project {
    id
    title
    startDate
    endDate
    tasks {
      ...Task
    }
  }
  ${TaskFragmentDoc}
`
export const UserFragmentDoc = gql`
  fragment User on User {
    id
    name
    image
  }
`
export const CreateWorkHourDocument = gql`
  mutation createWorkHour($duration: Int!, $taskId: ID!, $date: Date!, $comment: String) {
    createWorkHour(duration: $duration, taskId: $taskId, date: $date, comment: $comment) {
      id
      comment
      date
      duration
      project {
        id
        title
        startDate
        endDate
      }
    }
  }
`

export function useCreateWorkHourMutation() {
  return Urql.useMutation<CreateWorkHourMutation, CreateWorkHourMutationVariables>(CreateWorkHourDocument)
}
export const ProjectDocument = gql`
  query project($projectId: ID!) {
    project(projectId: $projectId) {
      ...Project
      tasks {
        ...Task
      }
    }
  }
  ${ProjectFragmentDoc}
  ${TaskFragmentDoc}
`

export function useProjectQuery(options: Omit<Urql.UseQueryArgs<ProjectQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ProjectQuery>({ query: ProjectDocument, ...options })
}
export const ProjectsDocument = gql`
  query projects {
    projects {
      ...Project
    }
  }
  ${ProjectFragmentDoc}
`

export function useProjectsQuery(options: Omit<Urql.UseQueryArgs<ProjectsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<ProjectsQuery>({ query: ProjectsDocument, ...options })
}
export const ProjectCreateDocument = gql`
  mutation projectCreate($data: ProjectInput!) {
    projectCreate(data: $data) {
      ...Project
    }
  }
  ${ProjectFragmentDoc}
`

export function useProjectCreateMutation() {
  return Urql.useMutation<ProjectCreateMutation, ProjectCreateMutationVariables>(ProjectCreateDocument)
}
export const ProjectDeleteDocument = gql`
  mutation projectDelete($id: ID!) {
    projectDelete(id: $id) {
      ...Project
    }
  }
  ${ProjectFragmentDoc}
`

export function useProjectDeleteMutation() {
  return Urql.useMutation<ProjectDeleteMutation, ProjectDeleteMutationVariables>(ProjectDeleteDocument)
}
export const ProjectUpdateDocument = gql`
  mutation projectUpdate($id: ID!, $data: ProjectInput!) {
    projectUpdate(id: $id, data: $data) {
      ...Project
    }
  }
  ${ProjectFragmentDoc}
`

export function useProjectUpdateMutation() {
  return Urql.useMutation<ProjectUpdateMutation, ProjectUpdateMutationVariables>(ProjectUpdateDocument)
}
export const TaskCreateDocument = gql`
  mutation taskCreate($data: TaskInput!) {
    taskCreate(data: $data) {
      ...Task
    }
  }
  ${TaskFragmentDoc}
`

export function useTaskCreateMutation() {
  return Urql.useMutation<TaskCreateMutation, TaskCreateMutationVariables>(TaskCreateDocument)
}
export const TaskDeleteDocument = gql`
  mutation taskDelete($id: ID!) {
    taskDelete(id: $id) {
      ...Task
    }
  }
  ${TaskFragmentDoc}
`

export function useTaskDeleteMutation() {
  return Urql.useMutation<TaskDeleteMutation, TaskDeleteMutationVariables>(TaskDeleteDocument)
}
export const UsersDocument = gql`
  query users {
    users {
      ...User
    }
  }
  ${UserFragmentDoc}
`

export function useUsersQuery(options: Omit<Urql.UseQueryArgs<UsersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UsersQuery>({ query: UsersDocument, ...options })
}
export const TeamAcceptInviteDocument = gql`
  mutation teamAcceptInvite($inviteKey: String!) {
    teamAcceptInvite(inviteKey: $inviteKey) {
      id
      title
      slug
      theme
      inviteKey
      members {
        id
        name
      }
    }
  }
`

export function useTeamAcceptInviteMutation() {
  return Urql.useMutation<TeamAcceptInviteMutation, TeamAcceptInviteMutationVariables>(TeamAcceptInviteDocument)
}
