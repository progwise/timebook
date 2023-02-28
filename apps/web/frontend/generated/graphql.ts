/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import gql from 'graphql-tag'
import * as Urql from 'urql'
import { graphql, ResponseResolver, GraphQLRequest, GraphQLContext } from 'msw'
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
}

/** Adds the information whether the user can edit the entity */
export type ModifyInterface = {
  /** Can the user modify the entity */
  canModify: Scalars['Boolean']
}

export type Mutation = {
  __typename: 'Mutation'
  /** Create a new project */
  projectCreate: Project
  /** Delete a project */
  projectDelete: Project
  /** Assign user to Project */
  projectMembershipCreate: Project
  /** Unassign user to Project */
  projectMembershipDelete: Project
  /** Update a project */
  projectUpdate: Project
  /** Archive a task */
  taskArchive: Task
  /** Create a new Task */
  taskCreate: Task
  /** Delete a task */
  taskDelete: Task
  /** Update a task */
  taskUpdate: Task
  /** Accept an invite to a team */
  teamAcceptInvite: Team
  /** Archive a team */
  teamArchive: Team
  /** Create a new team */
  teamCreate: Team
  /** Delete a team */
  teamDelete: Team
  /** Unarchive a team */
  teamUnarchive: Team
  /** Update a team */
  teamUpdate: Team
  /** Updates the user capacity minutes */
  userCapacityUpdate: User
  /** Update a user role */
  userRoleUpdate: User
  /** Create a new WorkHour */
  workHourCreate: WorkHour
  /** Delete a work hour entry */
  workHourDelete: WorkHour
  /** Updates a work hour entry or creates if work hour does not exist */
  workHourUpdate: WorkHour
}

export type MutationProjectCreateArgs = {
  data: ProjectInput
  teamSlug: Scalars['String']
}

export type MutationProjectDeleteArgs = {
  id: Scalars['ID']
}

export type MutationProjectMembershipCreateArgs = {
  projectId: Scalars['ID']
  userId: Scalars['ID']
}

export type MutationProjectMembershipDeleteArgs = {
  projectId: Scalars['ID']
  userId: Scalars['ID']
}

export type MutationProjectUpdateArgs = {
  data: ProjectInput
  id: Scalars['ID']
}

export type MutationTaskArchiveArgs = {
  taskId: Scalars['ID']
}

export type MutationTaskCreateArgs = {
  data: TaskInput
}

export type MutationTaskDeleteArgs = {
  id: Scalars['ID']
}

export type MutationTaskUpdateArgs = {
  data: TaskInput
  id: Scalars['ID']
}

export type MutationTeamAcceptInviteArgs = {
  inviteKey: Scalars['String']
}

export type MutationTeamArchiveArgs = {
  teamId: Scalars['ID']
}

export type MutationTeamCreateArgs = {
  data: TeamInput
}

export type MutationTeamDeleteArgs = {
  id: Scalars['ID']
}

export type MutationTeamUnarchiveArgs = {
  teamId: Scalars['ID']
}

export type MutationTeamUpdateArgs = {
  data: TeamInput
  id: Scalars['ID']
}

export type MutationUserCapacityUpdateArgs = {
  availableMinutesPerWeek?: InputMaybe<Scalars['Int']>
  teamSlug: Scalars['String']
  userId: Scalars['ID']
}

export type MutationUserRoleUpdateArgs = {
  role: Role
  teamSlug: Scalars['String']
  userId: Scalars['ID']
}

export type MutationWorkHourCreateArgs = {
  data: WorkHourInput
}

export type MutationWorkHourDeleteArgs = {
  id: Scalars['ID']
}

export type MutationWorkHourUpdateArgs = {
  data: WorkHourInput
  date: Scalars['Date']
  taskId: Scalars['ID']
}

export type Project = ModifyInterface & {
  __typename: 'Project'
  /** Can the user modify the entity */
  canModify: Scalars['Boolean']
  endDate?: Maybe<Scalars['Date']>
  /** identifies the project */
  id: Scalars['ID']
  /** List of users that are member of the project */
  members: Array<User>
  startDate?: Maybe<Scalars['Date']>
  tasks: Array<Task>
  title: Scalars['String']
  workHours: Array<WorkHour>
}

export type ProjectTasksArgs = {
  showArchived?: Scalars['Boolean']
}

export type ProjectInput = {
  end?: InputMaybe<Scalars['Date']>
  start?: InputMaybe<Scalars['Date']>
  title: Scalars['String']
}

export type Query = {
  __typename: 'Query'
  /** Returns a single project */
  project: Project
  /** Returns all project of the signed in user that are active */
  projects: Array<Project>
  /** Returns a monthly project report */
  report: Report
  /** Returns a single task */
  task: Task
  /** Return a team by a slug */
  teamBySlug: Team
  /** Return all teams */
  teams: Array<Team>
  /** Returns a single user */
  user: User
  /** Returns a list of work hours for a given time period and a list of users */
  workHours: Array<WorkHour>
}

export type QueryProjectArgs = {
  projectId: Scalars['ID']
}

export type QueryProjectsArgs = {
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
}

export type QueryReportArgs = {
  from: Scalars['Date']
  projectId: Scalars['ID']
  to: Scalars['Date']
}

export type QueryTaskArgs = {
  taskId: Scalars['ID']
}

export type QueryTeamBySlugArgs = {
  slug: Scalars['String']
}

export type QueryTeamsArgs = {
  includeArchived?: Scalars['Boolean']
}

export type QueryUserArgs = {
  userId?: InputMaybe<Scalars['ID']>
}

export type QueryWorkHoursArgs = {
  from: Scalars['Date']
  teamSlug?: InputMaybe<Scalars['String']>
  to?: InputMaybe<Scalars['Date']>
  userIds?: InputMaybe<Array<Scalars['ID']>>
}

export type Report = {
  __typename: 'Report'
  groupedByDate: Array<ReportGroupedByDate>
  groupedByTask: Array<ReportGroupedByTask>
  groupedByUser: Array<ReportGroupedByUser>
}

export type ReportGroupedByDate = {
  __typename: 'ReportGroupedByDate'
  /** Booking date of the work hour */
  date: Scalars['Date']
  /** Sum of the total duration of all the work hours for the specific date */
  duration: Scalars['Int']
  workHours: Array<WorkHour>
}

export type ReportGroupedByTask = {
  __typename: 'ReportGroupedByTask'
  /** Sum of the total duration of all the work hours for the task */
  duration: Scalars['Int']
  task: Task
  workHours: Array<WorkHour>
}

export type ReportGroupedByUser = {
  __typename: 'ReportGroupedByUser'
  /** Sum of the total duration of all the work hours for a specific user */
  duration: Scalars['Int']
  user: User
  workHours: Array<WorkHour>
}

/** Roles a user can have in a team */
export enum Role {
  Admin = 'ADMIN',
  Member = 'MEMBER',
}

export type Task = ModifyInterface & {
  __typename: 'Task'
  archived: Scalars['Boolean']
  /** Can the user modify the entity */
  canModify: Scalars['Boolean']
  hasWorkHours: Scalars['Boolean']
  /** For calculating the money spent */
  hourlyRate?: Maybe<Scalars['Float']>
  /** Identifies the task */
  id: Scalars['ID']
  project: Project
  /** The user can identify the task in the UI */
  title: Scalars['String']
}

export type TaskInput = {
  projectId: Scalars['ID']
  title: Scalars['String']
}

export type Team = ModifyInterface & {
  __typename: 'Team'
  archived: Scalars['Boolean']
  /** Can the user modify the entity */
  canModify: Scalars['Boolean']
  /** Identifier of the team */
  id: Scalars['ID']
  inviteKey: Scalars['String']
  /** All members of the team */
  members: Array<User>
  /** List of all projects of the team */
  projects: Array<Project>
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
  __typename: 'User'
  /** Capacity of the user in the team */
  availableMinutesPerWeek?: Maybe<Scalars['Int']>
  id: Scalars['ID']
  image?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  /** Returns the list of projects where the user is a member */
  projects: Array<Project>
  /** Role of the user in a team */
  role: Role
}

export type UserAvailableMinutesPerWeekArgs = {
  teamSlug: Scalars['String']
}

export type UserProjectsArgs = {
  teamSlug: Scalars['String']
}

export type UserRoleArgs = {
  teamSlug: Scalars['String']
}

export type WorkHour = {
  __typename: 'WorkHour'
  date: Scalars['Date']
  /** Duration of the work hour in minutes */
  duration: Scalars['Int']
  /** Identifies the work hour */
  id: Scalars['ID']
  project: Project
  /** Task for which the working hour was booked */
  task: Task
  /** User who booked the work hours */
  user: User
}

export type WorkHourInput = {
  date: Scalars['Date']
  /** Duration of the work hour in minutes */
  duration: Scalars['Int']
  taskId: Scalars['ID']
}

export type ProjectQueryVariables = Exact<{
  projectId: Scalars['ID']
}>

export type ProjectQuery = {
  __typename: 'Query'
  project: {
    __typename: 'Project'
    canModify: boolean
    id: string
    title: string
    startDate?: string | null
    endDate?: string | null
    tasks: Array<{
      __typename: 'Task'
      canModify: boolean
      id: string
      title: string
      hasWorkHours: boolean
      hourlyRate?: number | null
      project: { __typename: 'Project'; id: string; title: string }
    }>
  }
}

export type TaskFragment = {
  __typename: 'Task'
  id: string
  title: string
  hasWorkHours: boolean
  hourlyRate?: number | null
  project: { __typename: 'Project'; id: string; title: string }
}

export type MyProjectsQueryVariables = Exact<{
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
}>

export type MyProjectsQuery = {
  __typename: 'Query'
  projects: Array<{
    __typename: 'Project'
    id: string
    title: string
    startDate?: string | null
    endDate?: string | null
    tasks: Array<{
      __typename: 'Task'
      id: string
      title: string
      hasWorkHours: boolean
      hourlyRate?: number | null
      project: { __typename: 'Project'; id: string; title: string }
    }>
  }>
}

export type ProjectsWithTasksQueryVariables = Exact<{
  slug: Scalars['String']
}>

export type ProjectsWithTasksQuery = {
  __typename: 'Query'
  teamBySlug: {
    __typename: 'Team'
    projects: Array<{
      __typename: 'Project'
      id: string
      title: string
      startDate?: string | null
      endDate?: string | null
      tasks: Array<{
        __typename: 'Task'
        id: string
        title: string
        hasWorkHours: boolean
        hourlyRate?: number | null
        project: { __typename: 'Project'; id: string; title: string }
      }>
    }>
  }
}

export type TeamProjectsQueryVariables = Exact<{
  slug: Scalars['String']
}>

export type TeamProjectsQuery = {
  __typename: 'Query'
  teamBySlug: {
    __typename: 'Team'
    projects: Array<{
      __typename: 'Project'
      id: string
      title: string
      startDate?: string | null
      endDate?: string | null
    }>
  }
}

export type ProjectFragment = {
  __typename: 'Project'
  id: string
  title: string
  startDate?: string | null
  endDate?: string | null
}

export type ProjectWithTasksFragment = {
  __typename: 'Project'
  id: string
  title: string
  startDate?: string | null
  endDate?: string | null
  tasks: Array<{
    __typename: 'Task'
    id: string
    title: string
    hasWorkHours: boolean
    hourlyRate?: number | null
    project: { __typename: 'Project'; id: string; title: string }
  }>
}

export type ProjectCreateMutationVariables = Exact<{
  data: ProjectInput
  teamSlug: Scalars['String']
}>

export type ProjectCreateMutation = {
  __typename: 'Mutation'
  projectCreate: {
    __typename: 'Project'
    id: string
    title: string
    startDate?: string | null
    endDate?: string | null
  }
}

export type ProjectDeleteMutationVariables = Exact<{
  id: Scalars['ID']
}>

export type ProjectDeleteMutation = {
  __typename: 'Mutation'
  projectDelete: {
    __typename: 'Project'
    id: string
    title: string
    startDate?: string | null
    endDate?: string | null
  }
}

export type ProjectUpdateMutationVariables = Exact<{
  id: Scalars['ID']
  data: ProjectInput
}>

export type ProjectUpdateMutation = {
  __typename: 'Mutation'
  projectUpdate: {
    __typename: 'Project'
    id: string
    title: string
    startDate?: string | null
    endDate?: string | null
  }
}

export type TaskCreateMutationVariables = Exact<{
  data: TaskInput
}>

export type TaskCreateMutation = {
  __typename: 'Mutation'
  taskCreate: {
    __typename: 'Task'
    id: string
    title: string
    hasWorkHours: boolean
    hourlyRate?: number | null
    project: { __typename: 'Project'; id: string; title: string }
  }
}

export type TaskDeleteMutationVariables = Exact<{
  id: Scalars['ID']
  hasWorkHours: Scalars['Boolean']
}>

export type TaskDeleteMutation = {
  __typename: 'Mutation'
  taskDelete?: {
    __typename: 'Task'
    id: string
    title: string
    hasWorkHours: boolean
    hourlyRate?: number | null
    project: { __typename: 'Project'; id: string; title: string }
  }
  taskArchive?: {
    __typename: 'Task'
    id: string
    title: string
    hasWorkHours: boolean
    hourlyRate?: number | null
    project: { __typename: 'Project'; id: string; title: string }
  }
}

export type TaskUpdateMutationVariables = Exact<{
  id: Scalars['ID']
  data: TaskInput
}>

export type TaskUpdateMutation = {
  __typename: 'Mutation'
  taskUpdate: {
    __typename: 'Task'
    id: string
    title: string
    hasWorkHours: boolean
    hourlyRate?: number | null
    project: { __typename: 'Project'; id: string; title: string }
  }
}

export type TeamQueryVariables = Exact<{
  teamSlug: Scalars['String']
}>

export type TeamQuery = {
  __typename: 'Query'
  teamBySlug: {
    __typename: 'Team'
    canModify: boolean
    id: string
    title: string
    slug: string
    theme: Theme
    inviteKey: string
    archived: boolean
    members: Array<{
      __typename: 'User'
      id: string
      name?: string | null
      image?: string | null
      projects: Array<{ __typename: 'Project'; id: string; title: string }>
    }>
  }
}

export type TeamFragment = {
  __typename: 'Team'
  id: string
  title: string
  slug: string
  theme: Theme
  inviteKey: string
  archived: boolean
}

export type TeamCreateMutationVariables = Exact<{
  data: TeamInput
}>

export type TeamCreateMutation = {
  __typename: 'Mutation'
  teamCreate: {
    __typename: 'Team'
    id: string
    title: string
    slug: string
    theme: Theme
    inviteKey: string
    archived: boolean
  }
}

export type TeamUpdateMutationVariables = Exact<{
  id: Scalars['ID']
  data: TeamInput
}>

export type TeamUpdateMutation = {
  __typename: 'Mutation'
  teamUpdate: {
    __typename: 'Team'
    id: string
    title: string
    slug: string
    theme: Theme
    inviteKey: string
    archived: boolean
  }
}

export type TeamsQueryVariables = Exact<{ [key: string]: never }>

export type TeamsQuery = {
  __typename: 'Query'
  teams: Array<{
    __typename: 'Team'
    id: string
    title: string
    slug: string
    theme: Theme
    inviteKey: string
    archived: boolean
  }>
}

export type TeamsWithProjectsQueryVariables = Exact<{
  includeArchived?: InputMaybe<Scalars['Boolean']>
}>

export type TeamsWithProjectsQuery = {
  __typename: 'Query'
  teams: Array<{
    __typename: 'Team'
    id: string
    title: string
    slug: string
    theme: Theme
    inviteKey: string
    archived: boolean
    projects: Array<{
      __typename: 'Project'
      id: string
      title: string
      startDate?: string | null
      endDate?: string | null
    }>
  }>
}

export type TeamWithProjectsFragment = {
  __typename: 'Team'
  id: string
  title: string
  slug: string
  theme: Theme
  inviteKey: string
  archived: boolean
  projects: Array<{
    __typename: 'Project'
    id: string
    title: string
    startDate?: string | null
    endDate?: string | null
  }>
}

export type UserCapacityUpdateMutationVariables = Exact<{
  userId: Scalars['ID']
  availableMinutesPerWeek?: InputMaybe<Scalars['Int']>
  teamSlug: Scalars['String']
}>

export type UserCapacityUpdateMutation = {
  __typename: 'Mutation'
  userCapacityUpdate: { __typename: 'User'; id: string; availableMinutesPerWeek?: number | null }
}

export type UserRoleUpdateMutationVariables = Exact<{
  userId: Scalars['ID']
  role: Role
  teamSlug: Scalars['String']
}>

export type UserRoleUpdateMutation = {
  __typename: 'Mutation'
  userRoleUpdate: { __typename: 'User'; id: string; role: Role }
}

export type WorkHourCreateMutationVariables = Exact<{
  data: WorkHourInput
}>

export type WorkHourCreateMutation = {
  __typename: 'Mutation'
  workHourCreate: {
    __typename: 'WorkHour'
    id: string
    date: string
    duration: number
    user: { __typename: 'User'; id: string; name?: string | null }
    project: { __typename: 'Project'; id: string; title: string; startDate?: string | null; endDate?: string | null }
    task: {
      __typename: 'Task'
      id: string
      title: string
      hasWorkHours: boolean
      hourlyRate?: number | null
      project: { __typename: 'Project'; id: string; title: string }
    }
  }
}

export type WorkHourDeleteMutationVariables = Exact<{
  id: Scalars['ID']
}>

export type WorkHourDeleteMutation = { __typename: 'Mutation'; workHourDelete: { __typename: 'WorkHour'; id: string } }

export type WorkHourUpdateMutationVariables = Exact<{
  data: WorkHourInput
  date: Scalars['Date']
  taskId: Scalars['ID']
}>

export type WorkHourUpdateMutation = {
  __typename: 'Mutation'
  workHourUpdate: {
    __typename: 'WorkHour'
    id: string
    date: string
    duration: number
    user: { __typename: 'User'; id: string; name?: string | null }
    project: { __typename: 'Project'; id: string; title: string; startDate?: string | null; endDate?: string | null }
    task: {
      __typename: 'Task'
      id: string
      title: string
      hasWorkHours: boolean
      hourlyRate?: number | null
      project: { __typename: 'Project'; id: string; title: string }
    }
  }
}

export type WorkHoursQueryVariables = Exact<{
  teamSlug?: InputMaybe<Scalars['String']>
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
}>

export type WorkHoursQuery = {
  __typename: 'Query'
  workHours: Array<{
    __typename: 'WorkHour'
    id: string
    date: string
    duration: number
    user: { __typename: 'User'; id: string; name?: string | null }
    project: { __typename: 'Project'; id: string; title: string; startDate?: string | null; endDate?: string | null }
    task: {
      __typename: 'Task'
      id: string
      title: string
      hasWorkHours: boolean
      hourlyRate?: number | null
      project: { __typename: 'Project'; id: string; title: string }
    }
  }>
}

export type WorkHourFragment = {
  __typename: 'WorkHour'
  id: string
  date: string
  duration: number
  user: { __typename: 'User'; id: string; name?: string | null }
  project: { __typename: 'Project'; id: string; title: string; startDate?: string | null; endDate?: string | null }
  task: {
    __typename: 'Task'
    id: string
    title: string
    hasWorkHours: boolean
    hourlyRate?: number | null
    project: { __typename: 'Project'; id: string; title: string }
  }
}

export type MeQueryVariables = Exact<{
  teamSlug: Scalars['String']
}>

export type MeQuery = {
  __typename: 'Query'
  user: {
    __typename: 'User'
    id: string
    image?: string | null
    name?: string | null
    role: Role
    projects: Array<{ __typename: 'Project'; id: string; title: string }>
  }
}

export type ReportQueryVariables = Exact<{
  projectId: Scalars['ID']
  from: Scalars['Date']
  to: Scalars['Date']
}>

export type ReportQuery = {
  __typename: 'Query'
  report: {
    __typename: 'Report'
    groupedByDate: Array<{
      __typename: 'ReportGroupedByDate'
      date: string
      duration: number
      workHours: Array<{
        __typename: 'WorkHour'
        id: string
        date: string
        duration: number
        user: { __typename: 'User'; id: string; name?: string | null; image?: string | null }
        task: {
          __typename: 'Task'
          id: string
          title: string
          project: { __typename: 'Project'; id: string; title: string }
        }
      }>
    }>
    groupedByTask: Array<{
      __typename: 'ReportGroupedByTask'
      duration: number
      task: { __typename: 'Task'; id: string; title: string }
    }>
    groupedByUser: Array<{
      __typename: 'ReportGroupedByUser'
      duration: number
      user: { __typename: 'User'; id: string; name?: string | null }
      workHours: Array<{
        __typename: 'WorkHour'
        id: string
        duration: number
        task: { __typename: 'Task'; title: string }
      }>
    }>
  }
}

export type TeamAcceptInviteMutationVariables = Exact<{
  inviteKey: Scalars['String']
}>

export type TeamAcceptInviteMutation = {
  __typename: 'Mutation'
  teamAcceptInvite: {
    __typename: 'Team'
    id: string
    title: string
    slug: string
    theme: Theme
    inviteKey: string
    members: Array<{ __typename: 'User'; id: string; name?: string | null }>
  }
}

export type ProjectMembershipCreateMutationVariables = Exact<{
  userID: Scalars['ID']
  projectID: Scalars['ID']
}>

export type ProjectMembershipCreateMutation = {
  __typename: 'Mutation'
  projectMembershipCreate: {
    __typename: 'Project'
    title: string
    members: Array<{ __typename: 'User'; name?: string | null }>
  }
}

export type ProjectMembershipDeleteMutationVariables = Exact<{
  userID: Scalars['ID']
  projectID: Scalars['ID']
}>

export type ProjectMembershipDeleteMutation = {
  __typename: 'Mutation'
  projectMembershipDelete: { __typename: 'Project'; title: string; members: Array<{ __typename: 'User'; id: string }> }
}

export type TeamArchiveMutationVariables = Exact<{
  teamId: Scalars['ID']
}>

export type TeamArchiveMutation = {
  __typename: 'Mutation'
  teamArchive: {
    __typename: 'Team'
    id: string
    title: string
    slug: string
    theme: Theme
    inviteKey: string
    archived: boolean
  }
}

export type TeamUnarchiveMutationVariables = Exact<{
  id: Scalars['ID']
}>

export type TeamUnarchiveMutation = {
  __typename: 'Mutation'
  teamUnarchive: {
    __typename: 'Team'
    id: string
    title: string
    slug: string
    theme: Theme
    inviteKey: string
    archived: boolean
  }
}

export type UserQueryVariables = Exact<{
  userId: Scalars['ID']
  teamSlug: Scalars['String']
}>

export type UserQuery = {
  __typename: 'Query'
  user: {
    __typename: 'User'
    id: string
    name?: string | null
    image?: string | null
    role: Role
    availableMinutesPerWeek?: number | null
    projects: Array<{ __typename: 'Project'; id: string; title: string }>
  }
}

export type UserFragment = {
  __typename: 'User'
  id: string
  name?: string | null
  image?: string | null
  role: Role
  availableMinutesPerWeek?: number | null
  projects: Array<{ __typename: 'Project'; id: string; title: string }>
}

export const TaskFragmentDoc = gql`
  fragment Task on Task {
    id
    title
    hasWorkHours
    hourlyRate
    project {
      id
      title
    }
  }
`
export const ProjectWithTasksFragmentDoc = gql`
  fragment ProjectWithTasks on Project {
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
export const TeamFragmentDoc = gql`
  fragment Team on Team {
    id
    title
    slug
    theme
    inviteKey
    archived
  }
`
export const ProjectFragmentDoc = gql`
  fragment Project on Project {
    id
    title
    startDate
    endDate
  }
`
export const TeamWithProjectsFragmentDoc = gql`
  fragment TeamWithProjects on Team {
    ...Team
    projects {
      ...Project
    }
  }
  ${TeamFragmentDoc}
  ${ProjectFragmentDoc}
`
export const WorkHourFragmentDoc = gql`
  fragment WorkHour on WorkHour {
    id
    date
    duration
    user {
      id
      name
    }
    project {
      ...Project
    }
    task {
      ...Task
    }
  }
  ${ProjectFragmentDoc}
  ${TaskFragmentDoc}
`
export const UserFragmentDoc = gql`
  fragment User on User {
    id
    name
    image
    role(teamSlug: $teamSlug)
    projects(teamSlug: $teamSlug) {
      id
      title
    }
    availableMinutesPerWeek(teamSlug: $teamSlug)
  }
`
export const ProjectDocument = gql`
  query project($projectId: ID!) {
    project(projectId: $projectId) {
      ...Project
      canModify
      tasks {
        canModify
        ...Task
      }
    }
  }
  ${ProjectFragmentDoc}
  ${TaskFragmentDoc}
`

export function useProjectQuery(options: Omit<Urql.UseQueryArgs<ProjectQueryVariables>, 'query'>) {
  return Urql.useQuery<ProjectQuery, ProjectQueryVariables>({ query: ProjectDocument, ...options })
}
export const MyProjectsDocument = gql`
  query myProjects($from: Date!, $to: Date) {
    projects(from: $from, to: $to) {
      ...ProjectWithTasks
    }
  }
  ${ProjectWithTasksFragmentDoc}
`

export function useMyProjectsQuery(options: Omit<Urql.UseQueryArgs<MyProjectsQueryVariables>, 'query'>) {
  return Urql.useQuery<MyProjectsQuery, MyProjectsQueryVariables>({ query: MyProjectsDocument, ...options })
}
export const ProjectsWithTasksDocument = gql`
  query projectsWithTasks($slug: String!) {
    teamBySlug(slug: $slug) {
      projects {
        ...ProjectWithTasks
      }
    }
  }
  ${ProjectWithTasksFragmentDoc}
`

export function useProjectsWithTasksQuery(options: Omit<Urql.UseQueryArgs<ProjectsWithTasksQueryVariables>, 'query'>) {
  return Urql.useQuery<ProjectsWithTasksQuery, ProjectsWithTasksQueryVariables>({
    query: ProjectsWithTasksDocument,
    ...options,
  })
}
export const TeamProjectsDocument = gql`
  query teamProjects($slug: String!) {
    teamBySlug(slug: $slug) {
      projects {
        ...Project
      }
    }
  }
  ${ProjectFragmentDoc}
`

export function useTeamProjectsQuery(options: Omit<Urql.UseQueryArgs<TeamProjectsQueryVariables>, 'query'>) {
  return Urql.useQuery<TeamProjectsQuery, TeamProjectsQueryVariables>({ query: TeamProjectsDocument, ...options })
}
export const ProjectCreateDocument = gql`
  mutation projectCreate($data: ProjectInput!, $teamSlug: String!) {
    projectCreate(data: $data, teamSlug: $teamSlug) {
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
  mutation taskDelete($id: ID!, $hasWorkHours: Boolean!) {
    taskDelete(id: $id) @skip(if: $hasWorkHours) {
      ...Task
    }
    taskArchive(taskId: $id) @include(if: $hasWorkHours) {
      ...Task
    }
  }
  ${TaskFragmentDoc}
`

export function useTaskDeleteMutation() {
  return Urql.useMutation<TaskDeleteMutation, TaskDeleteMutationVariables>(TaskDeleteDocument)
}
export const TaskUpdateDocument = gql`
  mutation taskUpdate($id: ID!, $data: TaskInput!) {
    taskUpdate(id: $id, data: $data) {
      ...Task
    }
  }
  ${TaskFragmentDoc}
`

export function useTaskUpdateMutation() {
  return Urql.useMutation<TaskUpdateMutation, TaskUpdateMutationVariables>(TaskUpdateDocument)
}
export const TeamDocument = gql`
  query team($teamSlug: String!) {
    teamBySlug(slug: $teamSlug) {
      ...Team
      canModify
      members {
        id
        name
        image
        projects(teamSlug: $teamSlug) {
          id
          title
        }
      }
    }
  }
  ${TeamFragmentDoc}
`

export function useTeamQuery(options: Omit<Urql.UseQueryArgs<TeamQueryVariables>, 'query'>) {
  return Urql.useQuery<TeamQuery, TeamQueryVariables>({ query: TeamDocument, ...options })
}
export const TeamCreateDocument = gql`
  mutation teamCreate($data: TeamInput!) {
    teamCreate(data: $data) {
      ...Team
    }
  }
  ${TeamFragmentDoc}
`

export function useTeamCreateMutation() {
  return Urql.useMutation<TeamCreateMutation, TeamCreateMutationVariables>(TeamCreateDocument)
}
export const TeamUpdateDocument = gql`
  mutation teamUpdate($id: ID!, $data: TeamInput!) {
    teamUpdate(id: $id, data: $data) {
      ...Team
    }
  }
  ${TeamFragmentDoc}
`

export function useTeamUpdateMutation() {
  return Urql.useMutation<TeamUpdateMutation, TeamUpdateMutationVariables>(TeamUpdateDocument)
}
export const TeamsDocument = gql`
  query teams {
    teams {
      ...Team
    }
  }
  ${TeamFragmentDoc}
`

export function useTeamsQuery(options?: Omit<Urql.UseQueryArgs<TeamsQueryVariables>, 'query'>) {
  return Urql.useQuery<TeamsQuery, TeamsQueryVariables>({ query: TeamsDocument, ...options })
}
export const TeamsWithProjectsDocument = gql`
  query teamsWithProjects($includeArchived: Boolean) {
    teams(includeArchived: $includeArchived) {
      ...TeamWithProjects
    }
  }
  ${TeamWithProjectsFragmentDoc}
`

export function useTeamsWithProjectsQuery(options?: Omit<Urql.UseQueryArgs<TeamsWithProjectsQueryVariables>, 'query'>) {
  return Urql.useQuery<TeamsWithProjectsQuery, TeamsWithProjectsQueryVariables>({
    query: TeamsWithProjectsDocument,
    ...options,
  })
}
export const UserCapacityUpdateDocument = gql`
  mutation userCapacityUpdate($userId: ID!, $availableMinutesPerWeek: Int, $teamSlug: String!) {
    userCapacityUpdate(userId: $userId, availableMinutesPerWeek: $availableMinutesPerWeek, teamSlug: $teamSlug) {
      id
      availableMinutesPerWeek(teamSlug: $teamSlug)
    }
  }
`

export function useUserCapacityUpdateMutation() {
  return Urql.useMutation<UserCapacityUpdateMutation, UserCapacityUpdateMutationVariables>(UserCapacityUpdateDocument)
}
export const UserRoleUpdateDocument = gql`
  mutation userRoleUpdate($userId: ID!, $role: Role!, $teamSlug: String!) {
    userRoleUpdate(userId: $userId, role: $role, teamSlug: $teamSlug) {
      id
      role(teamSlug: $teamSlug)
    }
  }
`

export function useUserRoleUpdateMutation() {
  return Urql.useMutation<UserRoleUpdateMutation, UserRoleUpdateMutationVariables>(UserRoleUpdateDocument)
}
export const WorkHourCreateDocument = gql`
  mutation workHourCreate($data: WorkHourInput!) {
    workHourCreate(data: $data) {
      ...WorkHour
    }
  }
  ${WorkHourFragmentDoc}
`

export function useWorkHourCreateMutation() {
  return Urql.useMutation<WorkHourCreateMutation, WorkHourCreateMutationVariables>(WorkHourCreateDocument)
}
export const WorkHourDeleteDocument = gql`
  mutation workHourDelete($id: ID!) {
    workHourDelete(id: $id) {
      id
    }
  }
`

export function useWorkHourDeleteMutation() {
  return Urql.useMutation<WorkHourDeleteMutation, WorkHourDeleteMutationVariables>(WorkHourDeleteDocument)
}
export const WorkHourUpdateDocument = gql`
  mutation workHourUpdate($data: WorkHourInput!, $date: Date!, $taskId: ID!) {
    workHourUpdate(data: $data, date: $date, taskId: $taskId) {
      ...WorkHour
    }
  }
  ${WorkHourFragmentDoc}
`

export function useWorkHourUpdateMutation() {
  return Urql.useMutation<WorkHourUpdateMutation, WorkHourUpdateMutationVariables>(WorkHourUpdateDocument)
}
export const WorkHoursDocument = gql`
  query workHours($teamSlug: String, $from: Date!, $to: Date) {
    workHours(teamSlug: $teamSlug, from: $from, to: $to) {
      ...WorkHour
    }
  }
  ${WorkHourFragmentDoc}
`

export function useWorkHoursQuery(options: Omit<Urql.UseQueryArgs<WorkHoursQueryVariables>, 'query'>) {
  return Urql.useQuery<WorkHoursQuery, WorkHoursQueryVariables>({ query: WorkHoursDocument, ...options })
}
export const MeDocument = gql`
  query me($teamSlug: String!) {
    user {
      id
      image
      name
      role(teamSlug: $teamSlug)
      projects(teamSlug: $teamSlug) {
        id
        title
      }
    }
  }
`

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options })
}
export const ReportDocument = gql`
  query report($projectId: ID!, $from: Date!, $to: Date!) {
    report(projectId: $projectId, from: $from, to: $to) {
      groupedByDate {
        date
        duration
        workHours {
          id
          date
          duration
          user {
            id
            name
            image
          }
          task {
            id
            title
            project {
              id
              title
            }
          }
        }
      }
      groupedByTask {
        task {
          id
          title
        }
        duration
      }
      groupedByUser {
        user {
          id
          name
        }
        duration
        workHours {
          id
          task {
            title
          }
          duration
        }
      }
    }
  }
`

export function useReportQuery(options: Omit<Urql.UseQueryArgs<ReportQueryVariables>, 'query'>) {
  return Urql.useQuery<ReportQuery, ReportQueryVariables>({ query: ReportDocument, ...options })
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
export const ProjectMembershipCreateDocument = gql`
  mutation projectMembershipCreate($userID: ID!, $projectID: ID!) {
    projectMembershipCreate(userId: $userID, projectId: $projectID) {
      title
      members {
        name
      }
    }
  }
`

export function useProjectMembershipCreateMutation() {
  return Urql.useMutation<ProjectMembershipCreateMutation, ProjectMembershipCreateMutationVariables>(
    ProjectMembershipCreateDocument,
  )
}
export const ProjectMembershipDeleteDocument = gql`
  mutation projectMembershipDelete($userID: ID!, $projectID: ID!) {
    projectMembershipDelete(userId: $userID, projectId: $projectID) {
      title
      members {
        id
      }
    }
  }
`

export function useProjectMembershipDeleteMutation() {
  return Urql.useMutation<ProjectMembershipDeleteMutation, ProjectMembershipDeleteMutationVariables>(
    ProjectMembershipDeleteDocument,
  )
}
export const TeamArchiveDocument = gql`
  mutation teamArchive($teamId: ID!) {
    teamArchive(teamId: $teamId) {
      ...Team
    }
  }
  ${TeamFragmentDoc}
`

export function useTeamArchiveMutation() {
  return Urql.useMutation<TeamArchiveMutation, TeamArchiveMutationVariables>(TeamArchiveDocument)
}
export const TeamUnarchiveDocument = gql`
  mutation teamUnarchive($id: ID!) {
    teamUnarchive(teamId: $id) {
      ...Team
    }
  }
  ${TeamFragmentDoc}
`

export function useTeamUnarchiveMutation() {
  return Urql.useMutation<TeamUnarchiveMutation, TeamUnarchiveMutationVariables>(TeamUnarchiveDocument)
}
export const UserDocument = gql`
  query user($userId: ID!, $teamSlug: String!) {
    user(userId: $userId) {
      ...User
    }
  }
  ${UserFragmentDoc}
`

export function useUserQuery(options: Omit<Urql.UseQueryArgs<UserQueryVariables>, 'query'>) {
  return Urql.useQuery<UserQuery, UserQueryVariables>({ query: UserDocument, ...options })
}

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProjectQuery((req, res, ctx) => {
 *   const { projectId } = req.variables;
 *   return res(
 *     ctx.data({ project })
 *   )
 * })
 */
export const mockProjectQuery = (
  resolver: ResponseResolver<GraphQLRequest<ProjectQueryVariables>, GraphQLContext<ProjectQuery>, any>,
) => graphql.query<ProjectQuery, ProjectQueryVariables>('project', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockMyProjectsQuery((req, res, ctx) => {
 *   const { from, to } = req.variables;
 *   return res(
 *     ctx.data({ projects })
 *   )
 * })
 */
export const mockMyProjectsQuery = (
  resolver: ResponseResolver<GraphQLRequest<MyProjectsQueryVariables>, GraphQLContext<MyProjectsQuery>, any>,
) => graphql.query<MyProjectsQuery, MyProjectsQueryVariables>('myProjects', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProjectsWithTasksQuery((req, res, ctx) => {
 *   const { slug } = req.variables;
 *   return res(
 *     ctx.data({ teamBySlug })
 *   )
 * })
 */
export const mockProjectsWithTasksQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<ProjectsWithTasksQueryVariables>,
    GraphQLContext<ProjectsWithTasksQuery>,
    any
  >,
) => graphql.query<ProjectsWithTasksQuery, ProjectsWithTasksQueryVariables>('projectsWithTasks', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTeamProjectsQuery((req, res, ctx) => {
 *   const { slug } = req.variables;
 *   return res(
 *     ctx.data({ teamBySlug })
 *   )
 * })
 */
export const mockTeamProjectsQuery = (
  resolver: ResponseResolver<GraphQLRequest<TeamProjectsQueryVariables>, GraphQLContext<TeamProjectsQuery>, any>,
) => graphql.query<TeamProjectsQuery, TeamProjectsQueryVariables>('teamProjects', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProjectCreateMutation((req, res, ctx) => {
 *   const { data, teamSlug } = req.variables;
 *   return res(
 *     ctx.data({ projectCreate })
 *   )
 * })
 */
export const mockProjectCreateMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<ProjectCreateMutationVariables>,
    GraphQLContext<ProjectCreateMutation>,
    any
  >,
) => graphql.mutation<ProjectCreateMutation, ProjectCreateMutationVariables>('projectCreate', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProjectDeleteMutation((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ projectDelete })
 *   )
 * })
 */
export const mockProjectDeleteMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<ProjectDeleteMutationVariables>,
    GraphQLContext<ProjectDeleteMutation>,
    any
  >,
) => graphql.mutation<ProjectDeleteMutation, ProjectDeleteMutationVariables>('projectDelete', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProjectUpdateMutation((req, res, ctx) => {
 *   const { id, data } = req.variables;
 *   return res(
 *     ctx.data({ projectUpdate })
 *   )
 * })
 */
export const mockProjectUpdateMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<ProjectUpdateMutationVariables>,
    GraphQLContext<ProjectUpdateMutation>,
    any
  >,
) => graphql.mutation<ProjectUpdateMutation, ProjectUpdateMutationVariables>('projectUpdate', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTaskCreateMutation((req, res, ctx) => {
 *   const { data } = req.variables;
 *   return res(
 *     ctx.data({ taskCreate })
 *   )
 * })
 */
export const mockTaskCreateMutation = (
  resolver: ResponseResolver<GraphQLRequest<TaskCreateMutationVariables>, GraphQLContext<TaskCreateMutation>, any>,
) => graphql.mutation<TaskCreateMutation, TaskCreateMutationVariables>('taskCreate', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTaskDeleteMutation((req, res, ctx) => {
 *   const { id, hasWorkHours } = req.variables;
 *   return res(
 *     ctx.data({ taskDelete, taskArchive })
 *   )
 * })
 */
export const mockTaskDeleteMutation = (
  resolver: ResponseResolver<GraphQLRequest<TaskDeleteMutationVariables>, GraphQLContext<TaskDeleteMutation>, any>,
) => graphql.mutation<TaskDeleteMutation, TaskDeleteMutationVariables>('taskDelete', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTaskUpdateMutation((req, res, ctx) => {
 *   const { id, data } = req.variables;
 *   return res(
 *     ctx.data({ taskUpdate })
 *   )
 * })
 */
export const mockTaskUpdateMutation = (
  resolver: ResponseResolver<GraphQLRequest<TaskUpdateMutationVariables>, GraphQLContext<TaskUpdateMutation>, any>,
) => graphql.mutation<TaskUpdateMutation, TaskUpdateMutationVariables>('taskUpdate', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTeamQuery((req, res, ctx) => {
 *   const { teamSlug } = req.variables;
 *   return res(
 *     ctx.data({ teamBySlug })
 *   )
 * })
 */
export const mockTeamQuery = (
  resolver: ResponseResolver<GraphQLRequest<TeamQueryVariables>, GraphQLContext<TeamQuery>, any>,
) => graphql.query<TeamQuery, TeamQueryVariables>('team', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTeamCreateMutation((req, res, ctx) => {
 *   const { data } = req.variables;
 *   return res(
 *     ctx.data({ teamCreate })
 *   )
 * })
 */
export const mockTeamCreateMutation = (
  resolver: ResponseResolver<GraphQLRequest<TeamCreateMutationVariables>, GraphQLContext<TeamCreateMutation>, any>,
) => graphql.mutation<TeamCreateMutation, TeamCreateMutationVariables>('teamCreate', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTeamUpdateMutation((req, res, ctx) => {
 *   const { id, data } = req.variables;
 *   return res(
 *     ctx.data({ teamUpdate })
 *   )
 * })
 */
export const mockTeamUpdateMutation = (
  resolver: ResponseResolver<GraphQLRequest<TeamUpdateMutationVariables>, GraphQLContext<TeamUpdateMutation>, any>,
) => graphql.mutation<TeamUpdateMutation, TeamUpdateMutationVariables>('teamUpdate', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTeamsQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ teams })
 *   )
 * })
 */
export const mockTeamsQuery = (
  resolver: ResponseResolver<GraphQLRequest<TeamsQueryVariables>, GraphQLContext<TeamsQuery>, any>,
) => graphql.query<TeamsQuery, TeamsQueryVariables>('teams', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTeamsWithProjectsQuery((req, res, ctx) => {
 *   const { includeArchived } = req.variables;
 *   return res(
 *     ctx.data({ teams })
 *   )
 * })
 */
export const mockTeamsWithProjectsQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<TeamsWithProjectsQueryVariables>,
    GraphQLContext<TeamsWithProjectsQuery>,
    any
  >,
) => graphql.query<TeamsWithProjectsQuery, TeamsWithProjectsQueryVariables>('teamsWithProjects', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUserCapacityUpdateMutation((req, res, ctx) => {
 *   const { userId, availableMinutesPerWeek, teamSlug } = req.variables;
 *   return res(
 *     ctx.data({ userCapacityUpdate })
 *   )
 * })
 */
export const mockUserCapacityUpdateMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<UserCapacityUpdateMutationVariables>,
    GraphQLContext<UserCapacityUpdateMutation>,
    any
  >,
) => graphql.mutation<UserCapacityUpdateMutation, UserCapacityUpdateMutationVariables>('userCapacityUpdate', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUserRoleUpdateMutation((req, res, ctx) => {
 *   const { userId, role, teamSlug } = req.variables;
 *   return res(
 *     ctx.data({ userRoleUpdate })
 *   )
 * })
 */
export const mockUserRoleUpdateMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<UserRoleUpdateMutationVariables>,
    GraphQLContext<UserRoleUpdateMutation>,
    any
  >,
) => graphql.mutation<UserRoleUpdateMutation, UserRoleUpdateMutationVariables>('userRoleUpdate', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockWorkHourCreateMutation((req, res, ctx) => {
 *   const { data } = req.variables;
 *   return res(
 *     ctx.data({ workHourCreate })
 *   )
 * })
 */
export const mockWorkHourCreateMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<WorkHourCreateMutationVariables>,
    GraphQLContext<WorkHourCreateMutation>,
    any
  >,
) => graphql.mutation<WorkHourCreateMutation, WorkHourCreateMutationVariables>('workHourCreate', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockWorkHourDeleteMutation((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ workHourDelete })
 *   )
 * })
 */
export const mockWorkHourDeleteMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<WorkHourDeleteMutationVariables>,
    GraphQLContext<WorkHourDeleteMutation>,
    any
  >,
) => graphql.mutation<WorkHourDeleteMutation, WorkHourDeleteMutationVariables>('workHourDelete', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockWorkHourUpdateMutation((req, res, ctx) => {
 *   const { data, date, taskId } = req.variables;
 *   return res(
 *     ctx.data({ workHourUpdate })
 *   )
 * })
 */
export const mockWorkHourUpdateMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<WorkHourUpdateMutationVariables>,
    GraphQLContext<WorkHourUpdateMutation>,
    any
  >,
) => graphql.mutation<WorkHourUpdateMutation, WorkHourUpdateMutationVariables>('workHourUpdate', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockWorkHoursQuery((req, res, ctx) => {
 *   const { teamSlug, from, to } = req.variables;
 *   return res(
 *     ctx.data({ workHours })
 *   )
 * })
 */
export const mockWorkHoursQuery = (
  resolver: ResponseResolver<GraphQLRequest<WorkHoursQueryVariables>, GraphQLContext<WorkHoursQuery>, any>,
) => graphql.query<WorkHoursQuery, WorkHoursQueryVariables>('workHours', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockMeQuery((req, res, ctx) => {
 *   const { teamSlug } = req.variables;
 *   return res(
 *     ctx.data({ user })
 *   )
 * })
 */
export const mockMeQuery = (
  resolver: ResponseResolver<GraphQLRequest<MeQueryVariables>, GraphQLContext<MeQuery>, any>,
) => graphql.query<MeQuery, MeQueryVariables>('me', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockReportQuery((req, res, ctx) => {
 *   const { projectId, from, to } = req.variables;
 *   return res(
 *     ctx.data({ report })
 *   )
 * })
 */
export const mockReportQuery = (
  resolver: ResponseResolver<GraphQLRequest<ReportQueryVariables>, GraphQLContext<ReportQuery>, any>,
) => graphql.query<ReportQuery, ReportQueryVariables>('report', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTeamAcceptInviteMutation((req, res, ctx) => {
 *   const { inviteKey } = req.variables;
 *   return res(
 *     ctx.data({ teamAcceptInvite })
 *   )
 * })
 */
export const mockTeamAcceptInviteMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<TeamAcceptInviteMutationVariables>,
    GraphQLContext<TeamAcceptInviteMutation>,
    any
  >,
) => graphql.mutation<TeamAcceptInviteMutation, TeamAcceptInviteMutationVariables>('teamAcceptInvite', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProjectMembershipCreateMutation((req, res, ctx) => {
 *   const { userID, projectID } = req.variables;
 *   return res(
 *     ctx.data({ projectMembershipCreate })
 *   )
 * })
 */
export const mockProjectMembershipCreateMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<ProjectMembershipCreateMutationVariables>,
    GraphQLContext<ProjectMembershipCreateMutation>,
    any
  >,
) =>
  graphql.mutation<ProjectMembershipCreateMutation, ProjectMembershipCreateMutationVariables>(
    'projectMembershipCreate',
    resolver,
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProjectMembershipDeleteMutation((req, res, ctx) => {
 *   const { userID, projectID } = req.variables;
 *   return res(
 *     ctx.data({ projectMembershipDelete })
 *   )
 * })
 */
export const mockProjectMembershipDeleteMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<ProjectMembershipDeleteMutationVariables>,
    GraphQLContext<ProjectMembershipDeleteMutation>,
    any
  >,
) =>
  graphql.mutation<ProjectMembershipDeleteMutation, ProjectMembershipDeleteMutationVariables>(
    'projectMembershipDelete',
    resolver,
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTeamArchiveMutation((req, res, ctx) => {
 *   const { teamId } = req.variables;
 *   return res(
 *     ctx.data({ teamArchive })
 *   )
 * })
 */
export const mockTeamArchiveMutation = (
  resolver: ResponseResolver<GraphQLRequest<TeamArchiveMutationVariables>, GraphQLContext<TeamArchiveMutation>, any>,
) => graphql.mutation<TeamArchiveMutation, TeamArchiveMutationVariables>('teamArchive', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTeamUnarchiveMutation((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ teamUnarchive })
 *   )
 * })
 */
export const mockTeamUnarchiveMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<TeamUnarchiveMutationVariables>,
    GraphQLContext<TeamUnarchiveMutation>,
    any
  >,
) => graphql.mutation<TeamUnarchiveMutation, TeamUnarchiveMutationVariables>('teamUnarchive', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockUserQuery((req, res, ctx) => {
 *   const { userId, teamSlug } = req.variables;
 *   return res(
 *     ctx.data({ user })
 *   )
 * })
 */
export const mockUserQuery = (
  resolver: ResponseResolver<GraphQLRequest<UserQueryVariables>, GraphQLContext<UserQuery>, any>,
) => graphql.query<UserQuery, UserQueryVariables>('user', resolver)
