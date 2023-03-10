/* eslint-disable unicorn/prevent-abbreviations */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/* eslint-disable @typescript-eslint/no-explicit-any */
import gql from 'graphql-tag'
import { graphql, ResponseResolver, GraphQLRequest, GraphQLContext } from 'msw'
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
  /** Assign user to a project. This mutation can also be used for updating the role of a project member */
  projectMembershipCreate: Project
  /** Unassign user to Project */
  projectMembershipDelete: Project
  /** Update a project */
  projectUpdate: Project
  reportLock: Report
  reportUnlock: Report
  /** Archive a task */
  taskArchive: Task
  /** Create a new Task */
  taskCreate: Task
  /** Delete a task */
  taskDelete: Task
  /** Update a task */
  taskUpdate: Task
  /** Create a new WorkHour */
  workHourCreate: WorkHour
  /** Delete a work hour entry */
  workHourDelete: WorkHour
  /** Updates a work hour entry or creates if work hour does not exist */
  workHourUpdate: WorkHour
}

export type MutationProjectCreateArgs = {
  data: ProjectInput
}

export type MutationProjectDeleteArgs = {
  id: Scalars['ID']
}

export type MutationProjectMembershipCreateArgs = {
  projectId: Scalars['ID']
  role?: Role
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

export type MutationReportLockArgs = {
  month: Scalars['Int']
  projectId: Scalars['ID']
  userId: Scalars['ID']
  year: Scalars['Int']
}

export type MutationReportUnlockArgs = {
  month: Scalars['Int']
  projectId: Scalars['ID']
  userId: Scalars['ID']
  year: Scalars['Int']
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
  data: TaskUpdateInput
  id: Scalars['ID']
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

export type ProjectMembersArgs = {
  includePastMembers?: Scalars['Boolean']
}

export type ProjectTasksArgs = {
  showArchived?: Scalars['Boolean']
}

export enum ProjectFilter {
  Active = 'ACTIVE',
  All = 'ALL',
  Future = 'FUTURE',
  Past = 'PAST',
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
  projectsCount: Scalars['Int']
  /** Returns a monthly project report */
  report: Report
  /** Returns a single task */
  task: Task
  /** Returns a single user */
  user: User
  /** Returns a list of work hours for a given time period and a list of users */
  workHours: Array<WorkHour>
}

export type QueryProjectArgs = {
  projectId: Scalars['ID']
}

export type QueryProjectsArgs = {
  filter?: ProjectFilter
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
}

export type QueryProjectsCountArgs = {
  filter: ProjectFilter
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
}

export type QueryReportArgs = {
  month: Scalars['Int']
  projectId: Scalars['ID']
  userId?: InputMaybe<Scalars['ID']>
  year: Scalars['Int']
}

export type QueryTaskArgs = {
  taskId: Scalars['ID']
}

export type QueryUserArgs = {
  userId?: InputMaybe<Scalars['ID']>
}

export type QueryWorkHoursArgs = {
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
  userIds?: InputMaybe<Array<Scalars['ID']>>
}

export type Report = {
  __typename: 'Report'
  groupedByDate: Array<ReportGroupedByDate>
  groupedByTask: Array<ReportGroupedByTask>
  groupedByUser: Array<ReportGroupedByUser>
  /** If set to true the work hours can not be updated */
  isLocked: Scalars['Boolean']
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
  workHours: Array<WorkHour>
}

export type TaskWorkHoursArgs = {
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
}

export type TaskInput = {
  hourlyRate?: InputMaybe<Scalars['Float']>
  projectId: Scalars['ID']
  title: Scalars['String']
}

export type TaskUpdateInput = {
  hourlyRate?: InputMaybe<Scalars['Float']>
  projectId?: InputMaybe<Scalars['ID']>
  title?: InputMaybe<Scalars['String']>
}

export type User = {
  __typename: 'User'
  durationWorkedOnProject: Scalars['Int']
  id: Scalars['ID']
  image?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  /** Role of the user in a project */
  role: Role
}

export type UserDurationWorkedOnProjectArgs = {
  from: Scalars['Date']
  projectId: Scalars['ID']
  to?: InputMaybe<Scalars['Date']>
}

export type UserRoleArgs = {
  projectId: Scalars['ID']
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

export type ReportUsersQueryVariables = Exact<{
  projectId: Scalars['ID']
  from: Scalars['Date']
  to: Scalars['Date']
}>

export type ReportUsersQuery = {
  __typename: 'Query'
  project: {
    __typename: 'Project'
    id: string
    members: Array<{ __typename: 'User'; durationWorkedOnProject: number; id: string; name?: string | null }>
  }
}

export type ReportUserFragment = {
  __typename: 'User'
  id: string
  name?: string | null
  durationWorkedOnProject: number
}

export type IsLockedQueryVariables = Exact<{
  year: Scalars['Int']
  month: Scalars['Int']
  projectId: Scalars['ID']
  userId: Scalars['ID']
}>

export type IsLockedQuery = { __typename: 'Query'; report: { __typename: 'Report'; isLocked: boolean } }

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
    members: Array<{ __typename: 'User'; id: string; name?: string | null; image?: string | null; role: Role }>
  }
}

export type SimpleUserFragment = {
  __typename: 'User'
  id: string
  name?: string | null
  image?: string | null
  role: Role
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
  filter?: InputMaybe<ProjectFilter>
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
  data: TaskUpdateInput
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

export type ProjectCountsQueryVariables = Exact<{
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
}>

export type ProjectCountsQuery = {
  __typename: 'Query'
  allCounts: number
  activeCounts: number
  futureCounts: number
  pastCounts: number
}

export type ReportQueryVariables = Exact<{
  projectId: Scalars['ID']
  month: Scalars['Int']
  year: Scalars['Int']
  userId?: InputMaybe<Scalars['ID']>
  groupByUser: Scalars['Boolean']
}>

export type ReportQuery = {
  __typename: 'Query'
  report: {
    __typename: 'Report'
    isLocked: boolean
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
    groupedByUser?: Array<{
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

export type ReportLockMutationVariables = Exact<{
  year: Scalars['Int']
  month: Scalars['Int']
  projectId: Scalars['ID']
  userId: Scalars['ID']
}>

export type ReportLockMutation = { __typename: 'Mutation'; reportLock: { __typename: 'Report'; isLocked: boolean } }

export type ReportUnlockMutationVariables = Exact<{
  year: Scalars['Int']
  month: Scalars['Int']
  projectId: Scalars['ID']
  userId: Scalars['ID']
}>

export type ReportUnlockMutation = { __typename: 'Mutation'; reportUnlock: { __typename: 'Report'; isLocked: boolean } }

export type TimeTableQueryVariables = Exact<{
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
}>

export type TimeTableQuery = {
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
      workHours: Array<{ __typename: 'WorkHour'; id: string; date: string; duration: number }>
      project: { __typename: 'Project'; id: string; title: string }
    }>
  }>
}

export type ProjectWithWorkHoursFragment = {
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
    workHours: Array<{ __typename: 'WorkHour'; id: string; date: string; duration: number }>
    project: { __typename: 'Project'; id: string; title: string }
  }>
}

export type TaskWithWorkHoursFragment = {
  __typename: 'Task'
  id: string
  title: string
  hasWorkHours: boolean
  hourlyRate?: number | null
  workHours: Array<{ __typename: 'WorkHour'; id: string; date: string; duration: number }>
  project: { __typename: 'Project'; id: string; title: string }
}

export type SimpleWorkHourFragment = { __typename: 'WorkHour'; id: string; date: string; duration: number }

export const ReportUserFragmentDoc = gql`
  fragment ReportUser on User {
    id
    name
    durationWorkedOnProject(from: $from, to: $to, projectId: $projectId)
  }
`
export const SimpleUserFragmentDoc = gql`
  fragment SimpleUser on User {
    id
    name
    image
    role(projectId: $projectId)
  }
`
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
export const ProjectFragmentDoc = gql`
  fragment Project on Project {
    id
    title
    startDate
    endDate
  }
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
export const SimpleWorkHourFragmentDoc = gql`
  fragment SimpleWorkHour on WorkHour {
    id
    date
    duration
  }
`
export const TaskWithWorkHoursFragmentDoc = gql`
  fragment TaskWithWorkHours on Task {
    ...Task
    workHours(from: $from, to: $to) {
      ...SimpleWorkHour
    }
  }
  ${TaskFragmentDoc}
  ${SimpleWorkHourFragmentDoc}
`
export const ProjectWithWorkHoursFragmentDoc = gql`
  fragment ProjectWithWorkHours on Project {
    ...Project
    tasks {
      ...TaskWithWorkHours
    }
  }
  ${ProjectFragmentDoc}
  ${TaskWithWorkHoursFragmentDoc}
`
export const ReportUsersDocument = gql`
  query reportUsers($projectId: ID!, $from: Date!, $to: Date!) {
    project(projectId: $projectId) {
      id
      members(includePastMembers: true) {
        ...ReportUser
        durationWorkedOnProject(from: $from, to: $to, projectId: $projectId)
      }
    }
  }
  ${ReportUserFragmentDoc}
`

export function useReportUsersQuery(options: Omit<Urql.UseQueryArgs<ReportUsersQueryVariables>, 'query'>) {
  return Urql.useQuery<ReportUsersQuery, ReportUsersQueryVariables>({ query: ReportUsersDocument, ...options })
}
export const IsLockedDocument = gql`
  query isLocked($year: Int!, $month: Int!, $projectId: ID!, $userId: ID!) {
    report(year: $year, month: $month, projectId: $projectId, userId: $userId) {
      isLocked
    }
  }
`

export function useIsLockedQuery(options: Omit<Urql.UseQueryArgs<IsLockedQueryVariables>, 'query'>) {
  return Urql.useQuery<IsLockedQuery, IsLockedQueryVariables>({ query: IsLockedDocument, ...options })
}
export const ProjectDocument = gql`
  query project($projectId: ID!) {
    project(projectId: $projectId) {
      ...Project
      canModify
      tasks {
        canModify
        ...Task
      }
      members {
        ...SimpleUser
      }
    }
  }
  ${ProjectFragmentDoc}
  ${TaskFragmentDoc}
  ${SimpleUserFragmentDoc}
`

export function useProjectQuery(options: Omit<Urql.UseQueryArgs<ProjectQueryVariables>, 'query'>) {
  return Urql.useQuery<ProjectQuery, ProjectQueryVariables>({ query: ProjectDocument, ...options })
}
export const MyProjectsDocument = gql`
  query myProjects($from: Date!, $to: Date, $filter: ProjectFilter) {
    projects(from: $from, to: $to, filter: $filter) {
      ...ProjectWithTasks
    }
  }
  ${ProjectWithTasksFragmentDoc}
`

export function useMyProjectsQuery(options: Omit<Urql.UseQueryArgs<MyProjectsQueryVariables>, 'query'>) {
  return Urql.useQuery<MyProjectsQuery, MyProjectsQueryVariables>({ query: MyProjectsDocument, ...options })
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
  mutation taskUpdate($id: ID!, $data: TaskUpdateInput!) {
    taskUpdate(id: $id, data: $data) {
      ...Task
    }
  }
  ${TaskFragmentDoc}
`

export function useTaskUpdateMutation() {
  return Urql.useMutation<TaskUpdateMutation, TaskUpdateMutationVariables>(TaskUpdateDocument)
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
  query workHours($from: Date!, $to: Date) {
    workHours(from: $from, to: $to) {
      ...WorkHour
    }
  }
  ${WorkHourFragmentDoc}
`

export function useWorkHoursQuery(options: Omit<Urql.UseQueryArgs<WorkHoursQueryVariables>, 'query'>) {
  return Urql.useQuery<WorkHoursQuery, WorkHoursQueryVariables>({ query: WorkHoursDocument, ...options })
}
export const ProjectCountsDocument = gql`
  query projectCounts($from: Date!, $to: Date) {
    allCounts: projectsCount(from: $from, to: $to, filter: ALL)
    activeCounts: projectsCount(from: $from, to: $to, filter: ACTIVE)
    futureCounts: projectsCount(from: $from, to: $to, filter: FUTURE)
    pastCounts: projectsCount(from: $from, to: $to, filter: PAST)
  }
`

export function useProjectCountsQuery(options: Omit<Urql.UseQueryArgs<ProjectCountsQueryVariables>, 'query'>) {
  return Urql.useQuery<ProjectCountsQuery, ProjectCountsQueryVariables>({ query: ProjectCountsDocument, ...options })
}
export const ReportDocument = gql`
  query report($projectId: ID!, $month: Int!, $year: Int!, $userId: ID, $groupByUser: Boolean!) {
    report(projectId: $projectId, month: $month, year: $year, userId: $userId) {
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
      groupedByUser @include(if: $groupByUser) {
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
      isLocked
    }
  }
`

export function useReportQuery(options: Omit<Urql.UseQueryArgs<ReportQueryVariables>, 'query'>) {
  return Urql.useQuery<ReportQuery, ReportQueryVariables>({ query: ReportDocument, ...options })
}
export const ReportLockDocument = gql`
  mutation reportLock($year: Int!, $month: Int!, $projectId: ID!, $userId: ID!) {
    reportLock(year: $year, month: $month, projectId: $projectId, userId: $userId) {
      isLocked
    }
  }
`

export function useReportLockMutation() {
  return Urql.useMutation<ReportLockMutation, ReportLockMutationVariables>(ReportLockDocument)
}
export const ReportUnlockDocument = gql`
  mutation reportUnlock($year: Int!, $month: Int!, $projectId: ID!, $userId: ID!) {
    reportUnlock(year: $year, month: $month, projectId: $projectId, userId: $userId) {
      isLocked
    }
  }
`

export function useReportUnlockMutation() {
  return Urql.useMutation<ReportUnlockMutation, ReportUnlockMutationVariables>(ReportUnlockDocument)
}
export const TimeTableDocument = gql`
  query timeTable($from: Date!, $to: Date) {
    projects(from: $from, to: $to) {
      ...ProjectWithWorkHours
    }
  }
  ${ProjectWithWorkHoursFragmentDoc}
`

export function useTimeTableQuery(options: Omit<Urql.UseQueryArgs<TimeTableQueryVariables>, 'query'>) {
  return Urql.useQuery<TimeTableQuery, TimeTableQueryVariables>({ query: TimeTableDocument, ...options })
}

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockReportUsersQuery((req, res, ctx) => {
 *   const { projectId, from, to } = req.variables;
 *   return res(
 *     ctx.data({ project })
 *   )
 * })
 */
export const mockReportUsersQuery = (
  resolver: ResponseResolver<GraphQLRequest<ReportUsersQueryVariables>, GraphQLContext<ReportUsersQuery>, any>,
) => graphql.query<ReportUsersQuery, ReportUsersQueryVariables>('reportUsers', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockIsLockedQuery((req, res, ctx) => {
 *   const { year, month, projectId, userId } = req.variables;
 *   return res(
 *     ctx.data({ report })
 *   )
 * })
 */
export const mockIsLockedQuery = (
  resolver: ResponseResolver<GraphQLRequest<IsLockedQueryVariables>, GraphQLContext<IsLockedQuery>, any>,
) => graphql.query<IsLockedQuery, IsLockedQueryVariables>('isLocked', resolver)

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
 *   const { from, to, filter } = req.variables;
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
 * mockProjectCreateMutation((req, res, ctx) => {
 *   const { data } = req.variables;
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
 *   const { from, to } = req.variables;
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
 * mockProjectCountsQuery((req, res, ctx) => {
 *   const { from, to } = req.variables;
 *   return res(
 *     ctx.data({ projectsCount, projectsCount, projectsCount, projectsCount })
 *   )
 * })
 */
export const mockProjectCountsQuery = (
  resolver: ResponseResolver<GraphQLRequest<ProjectCountsQueryVariables>, GraphQLContext<ProjectCountsQuery>, any>,
) => graphql.query<ProjectCountsQuery, ProjectCountsQueryVariables>('projectCounts', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockReportQuery((req, res, ctx) => {
 *   const { projectId, month, year, userId, groupByUser } = req.variables;
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
 * mockReportLockMutation((req, res, ctx) => {
 *   const { year, month, projectId, userId } = req.variables;
 *   return res(
 *     ctx.data({ reportLock })
 *   )
 * })
 */
export const mockReportLockMutation = (
  resolver: ResponseResolver<GraphQLRequest<ReportLockMutationVariables>, GraphQLContext<ReportLockMutation>, any>,
) => graphql.mutation<ReportLockMutation, ReportLockMutationVariables>('reportLock', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockReportUnlockMutation((req, res, ctx) => {
 *   const { year, month, projectId, userId } = req.variables;
 *   return res(
 *     ctx.data({ reportUnlock })
 *   )
 * })
 */
export const mockReportUnlockMutation = (
  resolver: ResponseResolver<GraphQLRequest<ReportUnlockMutationVariables>, GraphQLContext<ReportUnlockMutation>, any>,
) => graphql.mutation<ReportUnlockMutation, ReportUnlockMutationVariables>('reportUnlock', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTimeTableQuery((req, res, ctx) => {
 *   const { from, to } = req.variables;
 *   return res(
 *     ctx.data({ projects })
 *   )
 * })
 */
export const mockTimeTableQuery = (
  resolver: ResponseResolver<GraphQLRequest<TimeTableQueryVariables>, GraphQLContext<TimeTableQuery>, any>,
) => graphql.query<TimeTableQuery, TimeTableQueryVariables>('timeTable', resolver)
