/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable unicorn/prevent-abbreviations */
import { graphql, ResponseResolver, GraphQLRequest, GraphQLContext } from 'msw'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
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
  __typename?: 'Mutation'
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
  __typename?: 'Project'
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
  __typename?: 'Query'
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
  __typename?: 'Report'
  groupedByDate: Array<ReportGroupedByDate>
  groupedByTask: Array<ReportGroupedByTask>
  groupedByUser: Array<ReportGroupedByUser>
  /** If set to true the work hours can not be updated */
  isLocked: Scalars['Boolean']
}

export type ReportGroupedByDate = {
  __typename?: 'ReportGroupedByDate'
  /** Booking date of the work hour */
  date: Scalars['Date']
  /** Sum of the total duration of all the work hours for the specific date */
  duration: Scalars['Int']
  workHours: Array<WorkHour>
}

export type ReportGroupedByTask = {
  __typename?: 'ReportGroupedByTask'
  /** Sum of the total duration of all the work hours for the task */
  duration: Scalars['Int']
  task: Task
  workHours: Array<WorkHour>
}

export type ReportGroupedByUser = {
  __typename?: 'ReportGroupedByUser'
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
  __typename?: 'Task'
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
  __typename?: 'User'
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
  __typename?: 'WorkHour'
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

export type DeleteProjectModalFragment = { __typename?: 'Project'; id: string; title: string }

export type ProjectDeleteMutationVariables = Exact<{
  id: Scalars['ID']
}>

export type ProjectDeleteMutation = { __typename?: 'Mutation'; projectDelete: { __typename?: 'Project'; id: string } }

export type DeleteTaskModalFragment = { __typename?: 'Task'; id: string; hasWorkHours: boolean; title: string }

export type TaskDeleteMutationVariables = Exact<{
  id: Scalars['ID']
  hasWorkHours: Scalars['Boolean']
}>

export type TaskDeleteMutation = {
  __typename?: 'Mutation'
  taskDelete?: { __typename?: 'Task'; id: string }
  taskArchive?: { __typename?: 'Task'; id: string }
}

export type ProjectFormFragment = {
  __typename?: 'Project'
  title: string
  startDate?: string | null
  endDate?: string | null
  canModify: boolean
  id: string
}

export type ProjectMemberListUserFragment = {
  __typename?: 'User'
  id: string
  image?: string | null
  name?: string | null
  role: Role
}

export type ProjectTableItemFragment = {
  __typename?: 'Project'
  id: string
  title: string
  startDate?: string | null
  endDate?: string | null
}

export type ReportProjectFragment = { __typename?: 'Project'; id: string; title: string }

export type ReportProjectsQueryVariables = Exact<{
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
  filter?: InputMaybe<ProjectFilter>
}>

export type ReportProjectsQuery = {
  __typename?: 'Query'
  projects: Array<{ __typename?: 'Project'; id: string; title: string }>
}

export type ReportQueryVariables = Exact<{
  projectId: Scalars['ID']
  month: Scalars['Int']
  year: Scalars['Int']
  userId?: InputMaybe<Scalars['ID']>
  groupByUser: Scalars['Boolean']
}>

export type ReportQuery = {
  __typename?: 'Query'
  report: {
    __typename?: 'Report'
    isLocked: boolean
    groupedByDate: Array<{
      __typename?: 'ReportGroupedByDate'
      date: string
      duration: number
      workHours: Array<{
        __typename?: 'WorkHour'
        id: string
        duration: number
        user: { __typename?: 'User'; name?: string | null }
        task: { __typename?: 'Task'; title: string }
      }>
    }>
    groupedByTask: Array<{
      __typename?: 'ReportGroupedByTask'
      duration: number
      task: { __typename?: 'Task'; id: string; title: string }
    }>
    groupedByUser?: Array<{
      __typename?: 'ReportGroupedByUser'
      duration: number
      user: { __typename?: 'User'; id: string; name?: string | null }
    }>
  }
}

export type ReportLockMutationVariables = Exact<{
  year: Scalars['Int']
  month: Scalars['Int']
  projectId: Scalars['ID']
  userId: Scalars['ID']
}>

export type ReportLockMutation = { __typename?: 'Mutation'; reportLock: { __typename?: 'Report'; isLocked: boolean } }

export type ReportUnlockMutationVariables = Exact<{
  year: Scalars['Int']
  month: Scalars['Int']
  projectId: Scalars['ID']
  userId: Scalars['ID']
}>

export type ReportUnlockMutation = {
  __typename?: 'Mutation'
  reportUnlock: { __typename?: 'Report'; isLocked: boolean }
}

export type ReportUserFragment = {
  __typename?: 'User'
  id: string
  name?: string | null
  durationWorkedOnProject: number
}

export type ReportUsersQueryVariables = Exact<{
  projectId: Scalars['ID']
  from: Scalars['Date']
  to: Scalars['Date']
}>

export type ReportUsersQuery = {
  __typename?: 'Query'
  project: {
    __typename?: 'Project'
    id: string
    members: Array<{ __typename?: 'User'; id: string; name?: string | null; durationWorkedOnProject: number }>
  }
}

export type TaskListProjectFragment = {
  __typename?: 'Project'
  id: string
  canModify: boolean
  tasks: Array<{
    __typename?: 'Task'
    id: string
    title: string
    hourlyRate?: number | null
    canModify: boolean
    hasWorkHours: boolean
  }>
}

export type TaskCreateMutationVariables = Exact<{
  data: TaskInput
}>

export type TaskCreateMutation = { __typename?: 'Mutation'; taskCreate: { __typename?: 'Task'; id: string } }

export type TaskRowFragment = {
  __typename?: 'Task'
  id: string
  title: string
  hourlyRate?: number | null
  canModify: boolean
  hasWorkHours: boolean
}

export type TaskUpdateMutationVariables = Exact<{
  id: Scalars['ID']
  data: TaskUpdateInput
}>

export type TaskUpdateMutation = { __typename?: 'Mutation'; taskUpdate: { __typename?: 'Task'; id: string } }

export type SheetDayRowFragment = {
  __typename?: 'WorkHour'
  id: string
  duration: number
  project: { __typename?: 'Project'; title: string }
  task: { __typename?: 'Task'; title: string }
  user: { __typename?: 'User'; name?: string | null }
}

export type WorkHoursQueryVariables = Exact<{
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
}>

export type WorkHoursQuery = {
  __typename?: 'Query'
  workHours: Array<{
    __typename?: 'WorkHour'
    date: string
    id: string
    duration: number
    project: { __typename?: 'Project'; title: string }
    task: { __typename?: 'Task'; title: string }
    user: { __typename?: 'User'; name?: string | null }
  }>
}

export type WeekTableProjectFragment = {
  __typename?: 'Project'
  id: string
  title: string
  tasks: Array<{
    __typename?: 'Task'
    id: string
    title: string
    workHours: Array<{ __typename?: 'WorkHour'; duration: number; date: string }>
    project: { __typename?: 'Project'; startDate?: string | null; endDate?: string | null; id: string }
  }>
}

export type WeekTableFooterFragment = { __typename?: 'WorkHour'; duration: number; date: string }

export type WeekTableProjectRowGroupFragment = {
  __typename?: 'Project'
  id: string
  title: string
  tasks: Array<{
    __typename?: 'Task'
    id: string
    title: string
    project: { __typename?: 'Project'; startDate?: string | null; endDate?: string | null; id: string }
    workHours: Array<{ __typename?: 'WorkHour'; duration: number; date: string }>
  }>
}

export type WorkHourUpdateMutationVariables = Exact<{
  data: WorkHourInput
  date: Scalars['Date']
  taskId: Scalars['ID']
}>

export type WorkHourUpdateMutation = {
  __typename?: 'Mutation'
  workHourUpdate: { __typename?: 'WorkHour'; id: string }
}

export type IsLockedQueryVariables = Exact<{
  year: Scalars['Int']
  month: Scalars['Int']
  projectId: Scalars['ID']
  userId: Scalars['ID']
}>

export type IsLockedQuery = { __typename?: 'Query'; report: { __typename?: 'Report'; isLocked: boolean } }

export type WeekTableTaskRowFragment = {
  __typename?: 'Task'
  id: string
  title: string
  project: { __typename?: 'Project'; startDate?: string | null; endDate?: string | null; id: string }
  workHours: Array<{ __typename?: 'WorkHour'; duration: number; date: string }>
}

export type ProjectQueryVariables = Exact<{
  projectId: Scalars['ID']
}>

export type ProjectQuery = {
  __typename?: 'Query'
  project: {
    __typename?: 'Project'
    id: string
    canModify: boolean
    title: string
    startDate?: string | null
    endDate?: string | null
    members: Array<{ __typename?: 'User'; id: string; image?: string | null; name?: string | null; role: Role }>
    tasks: Array<{
      __typename?: 'Task'
      id: string
      title: string
      hourlyRate?: number | null
      canModify: boolean
      hasWorkHours: boolean
    }>
  }
}

export type ProjectUpdateMutationVariables = Exact<{
  id: Scalars['ID']
  data: ProjectInput
}>

export type ProjectUpdateMutation = { __typename?: 'Mutation'; projectUpdate: { __typename?: 'Project'; id: string } }

export type MyProjectsQueryVariables = Exact<{
  from: Scalars['Date']
  filter?: InputMaybe<ProjectFilter>
}>

export type MyProjectsQuery = {
  __typename?: 'Query'
  projects: Array<{
    __typename?: 'Project'
    id: string
    title: string
    startDate?: string | null
    endDate?: string | null
  }>
}

export type ProjectCountsQueryVariables = Exact<{
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
}>

export type ProjectCountsQuery = {
  __typename?: 'Query'
  allCounts: number
  activeCounts: number
  futureCounts: number
  pastCounts: number
}

export type ProjectCreateMutationVariables = Exact<{
  data: ProjectInput
}>

export type ProjectCreateMutation = { __typename?: 'Mutation'; projectCreate: { __typename?: 'Project'; id: string } }

export type WeekTableQueryVariables = Exact<{
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
}>

export type WeekTableQuery = {
  __typename?: 'Query'
  projects: Array<{
    __typename?: 'Project'
    id: string
    title: string
    tasks: Array<{
      __typename?: 'Task'
      id: string
      title: string
      workHours: Array<{ __typename?: 'WorkHour'; duration: number; date: string }>
      project: { __typename?: 'Project'; startDate?: string | null; endDate?: string | null; id: string }
    }>
  }>
}

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
 * mockReportProjectsQuery((req, res, ctx) => {
 *   const { from, to, filter } = req.variables;
 *   return res(
 *     ctx.data({ projects })
 *   )
 * })
 */
export const mockReportProjectsQuery = (
  resolver: ResponseResolver<GraphQLRequest<ReportProjectsQueryVariables>, GraphQLContext<ReportProjectsQuery>, any>,
) => graphql.query<ReportProjectsQuery, ReportProjectsQueryVariables>('reportProjects', resolver)

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
 * mockMyProjectsQuery((req, res, ctx) => {
 *   const { from, filter } = req.variables;
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
 * mockWeekTableQuery((req, res, ctx) => {
 *   const { from, to } = req.variables;
 *   return res(
 *     ctx.data({ projects })
 *   )
 * })
 */
export const mockWeekTableQuery = (
  resolver: ResponseResolver<GraphQLRequest<WeekTableQueryVariables>, GraphQLContext<WeekTableQuery>, any>,
) => graphql.query<WeekTableQuery, WeekTableQueryVariables>('weekTable', resolver)
