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
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: string
}

export type AccessToken = {
  __typename?: 'AccessToken'
  /** Date when the access token was created */
  createdAt: Scalars['DateTime']
  id: Scalars['ID']
  name: Scalars['String']
}

/** Adds the information whether the user can edit the entity */
export type ModifyInterface = {
  /** Can the user modify the entity */
  canModify: Scalars['Boolean']
}

export type MonthInput = {
  month: Scalars['Int']
  year: Scalars['Int']
}

export type Mutation = {
  __typename?: 'Mutation'
  /** Create an access token for the signed in user */
  accessTokenCreate: Scalars['String']
  /** Delete an access token for the signed in user */
  accessTokenDelete: AccessToken
  /** Archive an organization */
  organizationArchive: Organization
  /** Create a new organization */
  organizationCreate: Organization
  /** Assign user to an organization */
  organizationMembershipCreate: Organization
  /** Unassign user from an organization */
  organizationMembershipDelete: Organization
  /** Cancel a PayPal subscription for organization */
  organizationPaypalSubscriptionCancel: Organization
  /** Create a PayPal subscription for organization */
  organizationPaypalSubscriptionIdCreate: Scalars['String']
  /** Unarchive an organization */
  organizationUnarchive: Organization
  /** Update an organization */
  organizationUpdate: Organization
  /** Archive a project */
  projectArchive: Project
  /** Create a new project */
  projectCreate: Project
  /** Delete a project */
  projectDelete: Project
  projectLock: Project
  /** Assign user to a project. This mutation can also be used for updating the role of a project member */
  projectMembershipCreate: Project
  /** Unassign user from a project */
  projectMembershipDelete: Project
  /** Create a project invitation */
  projectMembershipInvitationCreate: ProjectInvitation
  /** Add a user to a project using the invitation key. */
  projectMembershipJoin: Project
  /** Unarchive a project */
  projectUnarchive: Project
  projectUnlock: Project
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
  /** The ongoing time tracking will be deleted */
  trackingCancel?: Maybe<Tracking>
  /** Start time tracking for a task. When a tracking for the same task is already running the tracking keeps untouched. When a tracking for a different task is running, the on going tracking will be stopped and converted to work hours. */
  trackingStart: Tracking
  /** The ongoing time tracking will be stopped and converted to work hours */
  trackingStop: Array<WorkHour>
  /** Updates a comment of a work hour or creates one */
  workHourCommentUpdate: WorkHour
  /** Create a new WorkHour */
  workHourCreate: WorkHour
  /** Delete a work hour entry */
  workHourDelete: WorkHour
  /** Updates a work hour entry or creates if work hour does not exist */
  workHourUpdate: WorkHour
}

export type MutationAccessTokenCreateArgs = {
  name: Scalars['String']
}

export type MutationAccessTokenDeleteArgs = {
  id: Scalars['ID']
}

export type MutationOrganizationArchiveArgs = {
  organizationId: Scalars['ID']
}

export type MutationOrganizationCreateArgs = {
  data: OrganizationInput
}

export type MutationOrganizationMembershipCreateArgs = {
  organizationId: Scalars['ID']
  organizationRole?: Role
  userId: Scalars['ID']
}

export type MutationOrganizationMembershipDeleteArgs = {
  organizationId: Scalars['ID']
  userId: Scalars['ID']
}

export type MutationOrganizationPaypalSubscriptionCancelArgs = {
  organizationId: Scalars['ID']
}

export type MutationOrganizationPaypalSubscriptionIdCreateArgs = {
  organizationId: Scalars['ID']
}

export type MutationOrganizationUnarchiveArgs = {
  organizationId: Scalars['ID']
}

export type MutationOrganizationUpdateArgs = {
  data: OrganizationInput
  id: Scalars['ID']
}

export type MutationProjectArchiveArgs = {
  projectId: Scalars['ID']
}

export type MutationProjectCreateArgs = {
  data: ProjectInput
}

export type MutationProjectDeleteArgs = {
  id: Scalars['ID']
}

export type MutationProjectLockArgs = {
  date: MonthInput
  projectId: Scalars['ID']
}

export type MutationProjectMembershipCreateArgs = {
  projectId: Scalars['ID']
  projectRole?: Role
  userId: Scalars['ID']
}

export type MutationProjectMembershipDeleteArgs = {
  projectId: Scalars['ID']
  userId: Scalars['ID']
}

export type MutationProjectMembershipInvitationCreateArgs = {
  projectId: Scalars['ID']
}

export type MutationProjectMembershipJoinArgs = {
  invitationKey: Scalars['String']
}

export type MutationProjectUnarchiveArgs = {
  projectId: Scalars['ID']
}

export type MutationProjectUnlockArgs = {
  date: MonthInput
  projectId: Scalars['ID']
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
  data: TaskUpdateInput
  id: Scalars['ID']
}

export type MutationTrackingStartArgs = {
  taskId: Scalars['ID']
}

export type MutationWorkHourCommentUpdateArgs = {
  comment: Scalars['String']
  date: Scalars['Date']
  taskId: Scalars['ID']
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

export type Organization = ModifyInterface & {
  __typename?: 'Organization'
  address?: Maybe<Scalars['String']>
  /** Can the user modify the entity */
  canModify: Scalars['Boolean']
  /** identifies the organization */
  id: Scalars['ID']
  isArchived: Scalars['Boolean']
  /** List of users that are member of the organization */
  members: Array<User>
  paypalSubscriptionId?: Maybe<Scalars['String']>
  projects: Array<Project>
  /** Date when the current subscription expires */
  subscriptionExpiresAt?: Maybe<Scalars['DateTime']>
  /** Status of the subscription */
  subscriptionStatus?: Maybe<SubscriptionStatus>
  title: Scalars['String']
}

export enum OrganizationFilter {
  Active = 'ACTIVE',
  All = 'ALL',
  Archived = 'ARCHIVED',
}

export type OrganizationInput = {
  address?: InputMaybe<Scalars['String']>
  title: Scalars['String']
}

export type Project = ModifyInterface & {
  __typename?: 'Project'
  /** Can the user modify the entity */
  canModify: Scalars['Boolean']
  endDate?: Maybe<Scalars['Date']>
  hasWorkHours: Scalars['Boolean']
  /** identifies the project */
  id: Scalars['ID']
  isArchived: Scalars['Boolean']
  /** Is the project locked for the given month */
  isLocked: Scalars['Boolean']
  /** Is the user member of the project */
  isProjectMember: Scalars['Boolean']
  /** List of users that are member of the project */
  members: Array<User>
  organization?: Maybe<Organization>
  /** Can the user modify the entity */
  projectRole: Scalars['String']
  startDate?: Maybe<Scalars['Date']>
  /** List of tasks that belong to the project. When the user is no longer a member of the project, only the tasks that the user booked work hours on are returned. */
  tasks: Array<Task>
  title: Scalars['String']
}

export type ProjectIsLockedArgs = {
  date?: InputMaybe<MonthInput>
}

export type ProjectMembersArgs = {
  includePastMembers?: Scalars['Boolean']
}

export type ProjectTasksArgs = {
  showArchived?: Scalars['Boolean']
}

export enum ProjectFilter {
  Active = 'ACTIVE',
  ActiveOrArchived = 'ACTIVE_OR_ARCHIVED',
  All = 'ALL',
  Archived = 'ARCHIVED',
  Future = 'FUTURE',
  Past = 'PAST',
}

export type ProjectInput = {
  end?: InputMaybe<Scalars['Date']>
  organizationId?: InputMaybe<Scalars['String']>
  start?: InputMaybe<Scalars['Date']>
  title: Scalars['String']
}

export type ProjectInvitation = {
  __typename?: 'ProjectInvitation'
  expireDate: Scalars['DateTime']
  id: Scalars['ID']
  invitationKey: Scalars['String']
  project: Project
}

export type Query = {
  __typename?: 'Query'
  /** List of tokens of the signed in user */
  accessTokens: Array<AccessToken>
  currentTracking?: Maybe<Tracking>
  /** Returns a single Organization */
  organization: Organization
  /** Returns all organizations of the signed in user that are active */
  organizations: Array<Organization>
  organizationsCount: Scalars['Int']
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

export type QueryOrganizationArgs = {
  organizationId: Scalars['ID']
}

export type QueryOrganizationsArgs = {
  filter?: OrganizationFilter
}

export type QueryOrganizationsCountArgs = {
  filter: OrganizationFilter
}

export type QueryProjectArgs = {
  projectId: Scalars['ID']
}

export type QueryProjectsArgs = {
  filter?: ProjectFilter
  from: Scalars['Date']
  includeProjectsWhereUserBookedWorkHours?: Scalars['Boolean']
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

/** Status of the organization subscription */
export enum SubscriptionStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
}

export type Task = ModifyInterface & {
  __typename?: 'Task'
  archived: Scalars['Boolean']
  /** Can the user modify the entity */
  canModify: Scalars['Boolean']
  hasWorkHours: Scalars['Boolean']
  /** Identifies the task */
  id: Scalars['ID']
  isLocked: Scalars['Boolean']
  /** Is the task locked by an admin */
  isLockedByAdmin: Scalars['Boolean']
  project: Project
  /** The user can identify the task in the UI */
  title: Scalars['String']
  tracking?: Maybe<Tracking>
  /** The work hours of the task for each day of the given interval */
  workHourOfDays: Array<WorkHourOfDay>
  workHours: Array<WorkHour>
}

export type TaskWorkHourOfDaysArgs = {
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
}

export type TaskWorkHoursArgs = {
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
}

export type TaskInput = {
  isLocked?: InputMaybe<Scalars['Boolean']>
  projectId: Scalars['ID']
  title: Scalars['String']
}

export type TaskUpdateInput = {
  isLocked?: InputMaybe<Scalars['Boolean']>
  projectId?: InputMaybe<Scalars['ID']>
  title?: InputMaybe<Scalars['String']>
}

export type Tracking = {
  __typename?: 'Tracking'
  start: Scalars['DateTime']
  task: Task
}

export type User = {
  __typename?: 'User'
  durationWorkedOnProject: Scalars['Int']
  id: Scalars['ID']
  image?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  /** Role of the user in an organization */
  organizationRole: Role
  /** Role of the user in a project */
  projectRole: Role
}

export type UserDurationWorkedOnProjectArgs = {
  from: Scalars['Date']
  projectId: Scalars['ID']
  to?: InputMaybe<Scalars['Date']>
}

export type UserOrganizationRoleArgs = {
  organizationId: Scalars['ID']
}

export type UserProjectRoleArgs = {
  projectId: Scalars['ID']
}

export type WorkHour = {
  __typename?: 'WorkHour'
  /** Comment for the work hour */
  comment?: Maybe<Scalars['String']>
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

export type WorkHourOfDay = {
  __typename?: 'WorkHourOfDay'
  date: Scalars['Date']
  isLocked: Scalars['Boolean']
  workHour?: Maybe<WorkHour>
}

export type AccessTokenRowFragment = { __typename?: 'AccessToken'; id: string; name: string; createdAt: string }

export type AccessTokenDeleteMutationVariables = Exact<{
  id: Scalars['ID']
}>

export type AccessTokenDeleteMutation = {
  __typename?: 'Mutation'
  accessTokenDelete: { __typename?: 'AccessToken'; id: string }
}

export type DeleteTaskButtonFragment = { __typename?: 'Task'; id: string; hasWorkHours: boolean; title: string }

export type TaskDeleteMutationVariables = Exact<{
  id: Scalars['ID']
  hasWorkHours: Scalars['Boolean']
}>

export type TaskDeleteMutation = {
  __typename?: 'Mutation'
  taskDelete?: { __typename?: 'Task'; id: string }
  taskArchive?: { __typename?: 'Task'; id: string }
}

export type LockTaskButtonFragment = { __typename?: 'Task'; id: string; isLockedByAdmin: boolean }

export type TaskUpdateMutationVariables = Exact<{
  id: Scalars['ID']
  data: TaskUpdateInput
}>

export type TaskUpdateMutation = { __typename?: 'Mutation'; taskUpdate: { __typename?: 'Task'; id: string } }

export type ArchiveOrUnarchiveOrganizationButtonFragment = {
  __typename?: 'Organization'
  id: string
  isArchived: boolean
  title: string
}

export type ArchiveOrganizationButtonFragment = { __typename?: 'Organization'; id: string; title: string }

export type OrganizationArchiveMutationVariables = Exact<{
  organizationId: Scalars['ID']
}>

export type OrganizationArchiveMutation = {
  __typename?: 'Mutation'
  organizationArchive: { __typename?: 'Organization'; id: string; isArchived: boolean }
}

export type UnarchiveOrganizationButtonFragment = { __typename?: 'Organization'; id: string; title: string }

export type OrganizationUnarchiveMutationVariables = Exact<{
  organizationId: Scalars['ID']
}>

export type OrganizationUnarchiveMutation = {
  __typename?: 'Mutation'
  organizationUnarchive: { __typename?: 'Organization'; id: string; isArchived: boolean }
}

export type OrganizationFormFragment = {
  __typename?: 'Organization'
  title: string
  address?: string | null
  canModify: boolean
  subscriptionStatus?: SubscriptionStatus | null
  id: string
  isArchived: boolean
}

export type OrganizationSubscriptionStatusLabelFragment = {
  __typename?: 'Organization'
  subscriptionStatus?: SubscriptionStatus | null
}

export type SubscribeOrUnsubscribeOrganizationButtonFragment = {
  __typename?: 'Organization'
  id: string
  subscriptionStatus?: SubscriptionStatus | null
  title: string
}

export type UnsubscribeOrganizationButtonFragment = { __typename?: 'Organization'; id: string; title: string }

export type OrganizationUnsubscribeMutationVariables = Exact<{
  organizationId: Scalars['ID']
}>

export type OrganizationUnsubscribeMutation = {
  __typename?: 'Mutation'
  organizationPaypalSubscriptionCancel: { __typename?: 'Organization'; id: string }
}

export type OrganizationMemberListOrganizationFragment = {
  __typename?: 'Organization'
  id: string
  canModify: boolean
  title: string
  members: Array<{
    __typename?: 'User'
    id: string
    image?: string | null
    name?: string | null
    organizationRole: Role
  }>
}

export type OrganizationMembershipUpdateMutationVariables = Exact<{
  organizationId: Scalars['ID']
  userId: Scalars['ID']
  organizationRole: Role
}>

export type OrganizationMembershipUpdateMutation = {
  __typename?: 'Mutation'
  organizationMembershipCreate: { __typename?: 'Organization'; id: string }
}

export type RemoveUserFromOrganizationButtonUserFragment = { __typename?: 'User'; id: string; name?: string | null }

export type RemoveUserFromOrganizationButtonOrganizationFragment = {
  __typename?: 'Organization'
  id: string
  title: string
}

export type OrganizationMembershipDeleteMutationVariables = Exact<{
  organizationId: Scalars['ID']
  userId: Scalars['ID']
}>

export type OrganizationMembershipDeleteMutation = {
  __typename?: 'Mutation'
  organizationMembershipDelete: { __typename?: 'Organization'; id: string }
}

export type OrganizationTableItemFragment = { __typename?: 'Organization'; id: string; title: string }

export type ArchiveProjectButtonFragment = { __typename?: 'Project'; id: string; title: string }

export type ProjectArchiveMutationVariables = Exact<{
  projectId: Scalars['ID']
}>

export type ProjectArchiveMutation = {
  __typename?: 'Mutation'
  projectArchive: { __typename?: 'Project'; id: string; isArchived: boolean }
}

export type DeleteOrArchiveProjectButtonFragment = {
  __typename?: 'Project'
  id: string
  hasWorkHours: boolean
  isArchived: boolean
  title: string
}

export type DeleteProjectButtonFragment = { __typename?: 'Project'; id: string; title: string }

export type ProjectDeleteMutationVariables = Exact<{
  id: Scalars['ID']
}>

export type ProjectDeleteMutation = { __typename?: 'Mutation'; projectDelete: { __typename?: 'Project'; id: string } }

export type UnarchiveProjectButtonFragment = { __typename?: 'Project'; id: string; title: string }

export type ProjectUnarchiveMutationVariables = Exact<{
  projectId: Scalars['ID']
}>

export type ProjectUnarchiveMutation = {
  __typename?: 'Mutation'
  projectUnarchive: { __typename?: 'Project'; id: string; isArchived: boolean }
}

export type ProjectFormFragment = {
  __typename?: 'Project'
  title: string
  id: string
  startDate?: string | null
  endDate?: string | null
  canModify: boolean
  hasWorkHours: boolean
  isArchived: boolean
  organization?: { __typename?: 'Organization'; id: string; title: string; isArchived: boolean } | null
}

export type OrganizationFragment = { __typename?: 'Organization'; id: string; title: string; isArchived: boolean }

export type ProjectMembershipInvitationCreateMutationVariables = Exact<{
  projectId: Scalars['ID']
}>

export type ProjectMembershipInvitationCreateMutation = {
  __typename?: 'Mutation'
  projectMembershipInvitationCreate: {
    __typename?: 'ProjectInvitation'
    id: string
    invitationKey: string
    expireDate: string
  }
}

export type ProjectMemberListProjectFragment = {
  __typename?: 'Project'
  id: string
  canModify: boolean
  title: string
  members: Array<{ __typename?: 'User'; id: string; image?: string | null; name?: string | null; projectRole: Role }>
}

export type ProjectMembershipUpdateMutationVariables = Exact<{
  projectId: Scalars['ID']
  userId: Scalars['ID']
  projectRole: Role
}>

export type ProjectMembershipUpdateMutation = {
  __typename?: 'Mutation'
  projectMembershipCreate: { __typename?: 'Project'; id: string }
}

export type RemoveUserFromProjectButtonUserFragment = { __typename?: 'User'; id: string; name?: string | null }

export type RemoveUserFromProjectButtonProjectFragment = { __typename?: 'Project'; id: string; title: string }

export type ProjectMembershipDeleteMutationVariables = Exact<{
  projectId: Scalars['ID']
  userId: Scalars['ID']
}>

export type ProjectMembershipDeleteMutation = {
  __typename?: 'Mutation'
  projectMembershipDelete: { __typename?: 'Project'; id: string }
}

export type ProjectTableItemFragment = {
  __typename?: 'Project'
  id: string
  title: string
  startDate?: string | null
  endDate?: string | null
  members: Array<{ __typename?: 'User'; id: string; image?: string | null; name?: string | null }>
}

export type ProjectLockMutationVariables = Exact<{
  date: MonthInput
  projectId: Scalars['ID']
}>

export type ProjectLockMutation = {
  __typename?: 'Mutation'
  projectLock: { __typename?: 'Project'; isLocked: boolean }
}

export type ProjectUnlockMutationVariables = Exact<{
  date: MonthInput
  projectId: Scalars['ID']
}>

export type ProjectUnlockMutation = {
  __typename?: 'Mutation'
  projectUnlock: { __typename?: 'Project'; isLocked: boolean }
}

export type ReportProjectFragment = {
  __typename?: 'Project'
  id: string
  title: string
  canModify: boolean
  isArchived: boolean
  isLocked: boolean
}

export type ReportProjectsQueryVariables = Exact<{
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
  filter?: InputMaybe<ProjectFilter>
  date: MonthInput
}>

export type ReportProjectsQuery = {
  __typename?: 'Query'
  projects: Array<{
    __typename?: 'Project'
    id: string
    title: string
    canModify: boolean
    isArchived: boolean
    isLocked: boolean
  }>
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
  project: { __typename?: 'Project'; canModify: boolean }
  report: {
    __typename?: 'Report'
    groupedByDate: Array<{
      __typename?: 'ReportGroupedByDate'
      date: string
      duration: number
      workHours: Array<{
        __typename?: 'WorkHour'
        id: string
        duration: number
        user: { __typename?: 'User'; id: string; name?: string | null }
        task: { __typename?: 'Task'; id: string; title: string }
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
    canModify: boolean
    isLockedByAdmin: boolean
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
  canModify: boolean
  isLockedByAdmin: boolean
  hasWorkHours: boolean
}

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

export type CurrentTrackingQueryVariables = Exact<{ [key: string]: never }>

export type CurrentTrackingQuery = {
  __typename?: 'Query'
  currentTracking?: {
    __typename?: 'Tracking'
    start: string
    task: { __typename?: 'Task'; title: string; id: string; project: { __typename?: 'Project'; title: string } }
  } | null
}

export type TrackingButtonsTrackingFragment = {
  __typename?: 'Tracking'
  start: string
  task: { __typename?: 'Task'; id: string; title: string; project: { __typename?: 'Project'; title: string } }
}

export type TrackingButtonsTaskFragment = { __typename?: 'Task'; id: string; isLocked: boolean }

export type TrackingStartMutationVariables = Exact<{
  taskId: Scalars['ID']
}>

export type TrackingStartMutation = {
  __typename?: 'Mutation'
  trackingStart: { __typename?: 'Tracking'; start: string; task: { __typename?: 'Task'; id: string } }
}

export type TrackingStopMutationVariables = Exact<{ [key: string]: never }>

export type TrackingStopMutation = {
  __typename?: 'Mutation'
  trackingStop: Array<{ __typename?: 'WorkHour'; id: string; task: { __typename?: 'Task'; id: string } }>
}

export type TrackingCancelMutationVariables = Exact<{ [key: string]: never }>

export type TrackingCancelMutation = {
  __typename?: 'Mutation'
  trackingCancel?: { __typename?: 'Tracking'; start: string; task: { __typename?: 'Task'; id: string } } | null
}

export type WeekGridProjectFragment = {
  __typename?: 'Project'
  id: string
  title: string
  isArchived: boolean
  tasks: Array<{
    __typename?: 'Task'
    id: string
    title: string
    isLockedByAdmin: boolean
    isLocked: boolean
    workHourOfDays: Array<{
      __typename?: 'WorkHourOfDay'
      date: string
      isLocked: boolean
      workHour?: { __typename?: 'WorkHour'; duration: number; comment?: string | null } | null
    }>
    project: {
      __typename?: 'Project'
      startDate?: string | null
      endDate?: string | null
      id: string
      isProjectMember: boolean
      isArchived: boolean
    }
    tracking?: {
      __typename?: 'Tracking'
      start: string
      task: { __typename?: 'Task'; id: string; title: string; project: { __typename?: 'Project'; title: string } }
    } | null
  }>
}

export type WeekGridFooterFragment = {
  __typename?: 'WorkHourOfDay'
  date: string
  workHour?: { __typename?: 'WorkHour'; duration: number } | null
}

export type WeekGridProjectRowGroupFragment = {
  __typename?: 'Project'
  id: string
  title: string
  isArchived: boolean
  tasks: Array<{
    __typename?: 'Task'
    id: string
    title: string
    isLockedByAdmin: boolean
    isLocked: boolean
    workHourOfDays: Array<{
      __typename?: 'WorkHourOfDay'
      date: string
      isLocked: boolean
      workHour?: { __typename?: 'WorkHour'; duration: number; comment?: string | null } | null
    }>
    project: {
      __typename?: 'Project'
      startDate?: string | null
      endDate?: string | null
      id: string
      isProjectMember: boolean
      isArchived: boolean
    }
    tracking?: {
      __typename?: 'Tracking'
      start: string
      task: { __typename?: 'Task'; id: string; title: string; project: { __typename?: 'Project'; title: string } }
    } | null
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

export type WeekGridTaskRowFragment = {
  __typename?: 'Task'
  id: string
  title: string
  isLockedByAdmin: boolean
  isLocked: boolean
  project: {
    __typename?: 'Project'
    startDate?: string | null
    endDate?: string | null
    id: string
    isProjectMember: boolean
    isArchived: boolean
  }
  workHourOfDays: Array<{
    __typename?: 'WorkHourOfDay'
    date: string
    isLocked: boolean
    workHour?: { __typename?: 'WorkHour'; duration: number; comment?: string | null } | null
  }>
  tracking?: {
    __typename?: 'Tracking'
    start: string
    task: { __typename?: 'Task'; id: string; title: string; project: { __typename?: 'Project'; title: string } }
  } | null
}

export type WorkHourCommentFragmentFragment = {
  __typename?: 'Task'
  id: string
  title: string
  workHourOfDays: Array<{
    __typename?: 'WorkHourOfDay'
    date: string
    isLocked: boolean
    workHour?: { __typename?: 'WorkHour'; comment?: string | null } | null
  }>
}

export type CommentUpdateMutationVariables = Exact<{
  comment: Scalars['String']
  date: Scalars['Date']
  taskId: Scalars['ID']
}>

export type CommentUpdateMutation = {
  __typename?: 'Mutation'
  workHourCommentUpdate: { __typename?: 'WorkHour'; comment?: string | null }
}

export type AccessTokensQueryVariables = Exact<{ [key: string]: never }>

export type AccessTokensQuery = {
  __typename?: 'Query'
  accessTokens: Array<{ __typename?: 'AccessToken'; id: string; name: string; createdAt: string }>
}

export type AccessTokenCreateMutationVariables = Exact<{
  name: Scalars['String']
}>

export type AccessTokenCreateMutation = { __typename?: 'Mutation'; accessTokenCreate: string }

export type OrganizationPaypalSubscriptionIdCreateMutationVariables = Exact<{
  organizationId: Scalars['ID']
}>

export type OrganizationPaypalSubscriptionIdCreateMutation = {
  __typename?: 'Mutation'
  organizationPaypalSubscriptionIdCreate: string
}

export type OrganizationQueryVariables = Exact<{
  organizationId: Scalars['ID']
}>

export type OrganizationQuery = {
  __typename?: 'Query'
  organization: {
    __typename?: 'Organization'
    id: string
    title: string
    address?: string | null
    canModify: boolean
    subscriptionStatus?: SubscriptionStatus | null
    isArchived: boolean
    projects: Array<{
      __typename?: 'Project'
      id: string
      title: string
      startDate?: string | null
      endDate?: string | null
      members: Array<{ __typename?: 'User'; id: string; image?: string | null; name?: string | null }>
    }>
    members: Array<{
      __typename?: 'User'
      id: string
      image?: string | null
      name?: string | null
      organizationRole: Role
    }>
  }
}

export type OrganizationUpdateMutationVariables = Exact<{
  id: Scalars['ID']
  data: OrganizationInput
}>

export type OrganizationUpdateMutation = {
  __typename?: 'Mutation'
  organizationUpdate: { __typename?: 'Organization'; id: string }
}

export type MyOrganizationsQueryVariables = Exact<{
  filter?: InputMaybe<OrganizationFilter>
}>

export type MyOrganizationsQuery = {
  __typename?: 'Query'
  organizations: Array<{ __typename?: 'Organization'; id: string; title: string }>
}

export type OrganizationCountsQueryVariables = Exact<{ [key: string]: never }>

export type OrganizationCountsQuery = {
  __typename?: 'Query'
  allCounts: number
  activeCounts: number
  archivedCounts: number
}

export type OrganizationCreateMutationVariables = Exact<{
  data: OrganizationInput
}>

export type OrganizationCreateMutation = {
  __typename?: 'Mutation'
  organizationCreate: { __typename?: 'Organization'; id: string }
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
    hasWorkHours: boolean
    isArchived: boolean
    tasks: Array<{
      __typename?: 'Task'
      id: string
      title: string
      canModify: boolean
      isLockedByAdmin: boolean
      hasWorkHours: boolean
    }>
    organization?: { __typename?: 'Organization'; id: string; title: string; isArchived: boolean } | null
    members: Array<{ __typename?: 'User'; id: string; image?: string | null; name?: string | null; projectRole: Role }>
  }
  organizations: Array<{ __typename?: 'Organization'; id: string; title: string; isArchived: boolean }>
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
    members: Array<{ __typename?: 'User'; id: string; image?: string | null; name?: string | null }>
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
  archivedCounts: number
}

export type ProjectMembershipJoinMutationVariables = Exact<{
  invitationKey: Scalars['String']
}>

export type ProjectMembershipJoinMutation = {
  __typename?: 'Mutation'
  projectMembershipJoin: { __typename?: 'Project'; id: string }
}

export type ProjectCreateMutationVariables = Exact<{
  data: ProjectInput
}>

export type ProjectCreateMutation = { __typename?: 'Mutation'; projectCreate: { __typename?: 'Project'; id: string } }

export type OrganizationsQueryVariables = Exact<{ [key: string]: never }>

export type OrganizationsQuery = {
  __typename?: 'Query'
  organizations: Array<{ __typename?: 'Organization'; id: string; title: string; isArchived: boolean }>
}

export type WeekGridQueryVariables = Exact<{
  from: Scalars['Date']
  to?: InputMaybe<Scalars['Date']>
}>

export type WeekGridQuery = {
  __typename?: 'Query'
  projects: Array<{
    __typename?: 'Project'
    id: string
    title: string
    isArchived: boolean
    tasks: Array<{
      __typename?: 'Task'
      id: string
      title: string
      isLockedByAdmin: boolean
      isLocked: boolean
      workHourOfDays: Array<{
        __typename?: 'WorkHourOfDay'
        date: string
        isLocked: boolean
        workHour?: { __typename?: 'WorkHour'; duration: number; comment?: string | null } | null
      }>
      project: {
        __typename?: 'Project'
        startDate?: string | null
        endDate?: string | null
        id: string
        isProjectMember: boolean
        isArchived: boolean
      }
      tracking?: {
        __typename?: 'Tracking'
        start: string
        task: { __typename?: 'Task'; id: string; title: string; project: { __typename?: 'Project'; title: string } }
      } | null
    }>
  }>
}

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockAccessTokenDeleteMutation((req, res, ctx) => {
 *   const { id } = req.variables;
 *   return res(
 *     ctx.data({ accessTokenDelete })
 *   )
 * })
 */
export const mockAccessTokenDeleteMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<AccessTokenDeleteMutationVariables>,
    GraphQLContext<AccessTokenDeleteMutation>,
    any
  >,
) => graphql.mutation<AccessTokenDeleteMutation, AccessTokenDeleteMutationVariables>('accessTokenDelete', resolver)

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
 * mockOrganizationArchiveMutation((req, res, ctx) => {
 *   const { organizationId } = req.variables;
 *   return res(
 *     ctx.data({ organizationArchive })
 *   )
 * })
 */
export const mockOrganizationArchiveMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<OrganizationArchiveMutationVariables>,
    GraphQLContext<OrganizationArchiveMutation>,
    any
  >,
) =>
  graphql.mutation<OrganizationArchiveMutation, OrganizationArchiveMutationVariables>('organizationArchive', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockOrganizationUnarchiveMutation((req, res, ctx) => {
 *   const { organizationId } = req.variables;
 *   return res(
 *     ctx.data({ organizationUnarchive })
 *   )
 * })
 */
export const mockOrganizationUnarchiveMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<OrganizationUnarchiveMutationVariables>,
    GraphQLContext<OrganizationUnarchiveMutation>,
    any
  >,
) =>
  graphql.mutation<OrganizationUnarchiveMutation, OrganizationUnarchiveMutationVariables>(
    'organizationUnarchive',
    resolver,
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockOrganizationUnsubscribeMutation((req, res, ctx) => {
 *   const { organizationId } = req.variables;
 *   return res(
 *     ctx.data({ organizationPaypalSubscriptionCancel })
 *   )
 * })
 */
export const mockOrganizationUnsubscribeMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<OrganizationUnsubscribeMutationVariables>,
    GraphQLContext<OrganizationUnsubscribeMutation>,
    any
  >,
) =>
  graphql.mutation<OrganizationUnsubscribeMutation, OrganizationUnsubscribeMutationVariables>(
    'organizationUnsubscribe',
    resolver,
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockOrganizationMembershipUpdateMutation((req, res, ctx) => {
 *   const { organizationId, userId, organizationRole } = req.variables;
 *   return res(
 *     ctx.data({ organizationMembershipCreate })
 *   )
 * })
 */
export const mockOrganizationMembershipUpdateMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<OrganizationMembershipUpdateMutationVariables>,
    GraphQLContext<OrganizationMembershipUpdateMutation>,
    any
  >,
) =>
  graphql.mutation<OrganizationMembershipUpdateMutation, OrganizationMembershipUpdateMutationVariables>(
    'organizationMembershipUpdate',
    resolver,
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockOrganizationMembershipDeleteMutation((req, res, ctx) => {
 *   const { organizationId, userId } = req.variables;
 *   return res(
 *     ctx.data({ organizationMembershipDelete })
 *   )
 * })
 */
export const mockOrganizationMembershipDeleteMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<OrganizationMembershipDeleteMutationVariables>,
    GraphQLContext<OrganizationMembershipDeleteMutation>,
    any
  >,
) =>
  graphql.mutation<OrganizationMembershipDeleteMutation, OrganizationMembershipDeleteMutationVariables>(
    'OrganizationMembershipDelete',
    resolver,
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProjectArchiveMutation((req, res, ctx) => {
 *   const { projectId } = req.variables;
 *   return res(
 *     ctx.data({ projectArchive })
 *   )
 * })
 */
export const mockProjectArchiveMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<ProjectArchiveMutationVariables>,
    GraphQLContext<ProjectArchiveMutation>,
    any
  >,
) => graphql.mutation<ProjectArchiveMutation, ProjectArchiveMutationVariables>('projectArchive', resolver)

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
 * mockProjectUnarchiveMutation((req, res, ctx) => {
 *   const { projectId } = req.variables;
 *   return res(
 *     ctx.data({ projectUnarchive })
 *   )
 * })
 */
export const mockProjectUnarchiveMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<ProjectUnarchiveMutationVariables>,
    GraphQLContext<ProjectUnarchiveMutation>,
    any
  >,
) => graphql.mutation<ProjectUnarchiveMutation, ProjectUnarchiveMutationVariables>('projectUnarchive', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProjectMembershipInvitationCreateMutation((req, res, ctx) => {
 *   const { projectId } = req.variables;
 *   return res(
 *     ctx.data({ projectMembershipInvitationCreate })
 *   )
 * })
 */
export const mockProjectMembershipInvitationCreateMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<ProjectMembershipInvitationCreateMutationVariables>,
    GraphQLContext<ProjectMembershipInvitationCreateMutation>,
    any
  >,
) =>
  graphql.mutation<ProjectMembershipInvitationCreateMutation, ProjectMembershipInvitationCreateMutationVariables>(
    'projectMembershipInvitationCreate',
    resolver,
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProjectMembershipUpdateMutation((req, res, ctx) => {
 *   const { projectId, userId, projectRole } = req.variables;
 *   return res(
 *     ctx.data({ projectMembershipCreate })
 *   )
 * })
 */
export const mockProjectMembershipUpdateMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<ProjectMembershipUpdateMutationVariables>,
    GraphQLContext<ProjectMembershipUpdateMutation>,
    any
  >,
) =>
  graphql.mutation<ProjectMembershipUpdateMutation, ProjectMembershipUpdateMutationVariables>(
    'projectMembershipUpdate',
    resolver,
  )

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProjectMembershipDeleteMutation((req, res, ctx) => {
 *   const { projectId, userId } = req.variables;
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
 * mockProjectLockMutation((req, res, ctx) => {
 *   const { date, projectId } = req.variables;
 *   return res(
 *     ctx.data({ projectLock })
 *   )
 * })
 */
export const mockProjectLockMutation = (
  resolver: ResponseResolver<GraphQLRequest<ProjectLockMutationVariables>, GraphQLContext<ProjectLockMutation>, any>,
) => graphql.mutation<ProjectLockMutation, ProjectLockMutationVariables>('projectLock', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProjectUnlockMutation((req, res, ctx) => {
 *   const { date, projectId } = req.variables;
 *   return res(
 *     ctx.data({ projectUnlock })
 *   )
 * })
 */
export const mockProjectUnlockMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<ProjectUnlockMutationVariables>,
    GraphQLContext<ProjectUnlockMutation>,
    any
  >,
) => graphql.mutation<ProjectUnlockMutation, ProjectUnlockMutationVariables>('projectUnlock', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockReportProjectsQuery((req, res, ctx) => {
 *   const { from, to, filter, date } = req.variables;
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
 *     ctx.data({ project, report })
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
 * mockCurrentTrackingQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ currentTracking })
 *   )
 * })
 */
export const mockCurrentTrackingQuery = (
  resolver: ResponseResolver<GraphQLRequest<CurrentTrackingQueryVariables>, GraphQLContext<CurrentTrackingQuery>, any>,
) => graphql.query<CurrentTrackingQuery, CurrentTrackingQueryVariables>('currentTracking', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTrackingStartMutation((req, res, ctx) => {
 *   const { taskId } = req.variables;
 *   return res(
 *     ctx.data({ trackingStart })
 *   )
 * })
 */
export const mockTrackingStartMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<TrackingStartMutationVariables>,
    GraphQLContext<TrackingStartMutation>,
    any
  >,
) => graphql.mutation<TrackingStartMutation, TrackingStartMutationVariables>('trackingStart', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTrackingStopMutation((req, res, ctx) => {
 *   return res(
 *     ctx.data({ trackingStop })
 *   )
 * })
 */
export const mockTrackingStopMutation = (
  resolver: ResponseResolver<GraphQLRequest<TrackingStopMutationVariables>, GraphQLContext<TrackingStopMutation>, any>,
) => graphql.mutation<TrackingStopMutation, TrackingStopMutationVariables>('trackingStop', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockTrackingCancelMutation((req, res, ctx) => {
 *   return res(
 *     ctx.data({ trackingCancel })
 *   )
 * })
 */
export const mockTrackingCancelMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<TrackingCancelMutationVariables>,
    GraphQLContext<TrackingCancelMutation>,
    any
  >,
) => graphql.mutation<TrackingCancelMutation, TrackingCancelMutationVariables>('trackingCancel', resolver)

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
 * mockCommentUpdateMutation((req, res, ctx) => {
 *   const { comment, date, taskId } = req.variables;
 *   return res(
 *     ctx.data({ workHourCommentUpdate })
 *   )
 * })
 */
export const mockCommentUpdateMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<CommentUpdateMutationVariables>,
    GraphQLContext<CommentUpdateMutation>,
    any
  >,
) => graphql.mutation<CommentUpdateMutation, CommentUpdateMutationVariables>('commentUpdate', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockAccessTokensQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ accessTokens })
 *   )
 * })
 */
export const mockAccessTokensQuery = (
  resolver: ResponseResolver<GraphQLRequest<AccessTokensQueryVariables>, GraphQLContext<AccessTokensQuery>, any>,
) => graphql.query<AccessTokensQuery, AccessTokensQueryVariables>('accessTokens', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockAccessTokenCreateMutation((req, res, ctx) => {
 *   const { name } = req.variables;
 *   return res(
 *     ctx.data({ accessTokenCreate })
 *   )
 * })
 */
export const mockAccessTokenCreateMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<AccessTokenCreateMutationVariables>,
    GraphQLContext<AccessTokenCreateMutation>,
    any
  >,
) => graphql.mutation<AccessTokenCreateMutation, AccessTokenCreateMutationVariables>('accessTokenCreate', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockOrganizationPaypalSubscriptionIdCreateMutation((req, res, ctx) => {
 *   const { organizationId } = req.variables;
 *   return res(
 *     ctx.data({ organizationPaypalSubscriptionIdCreate })
 *   )
 * })
 */
export const mockOrganizationPaypalSubscriptionIdCreateMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<OrganizationPaypalSubscriptionIdCreateMutationVariables>,
    GraphQLContext<OrganizationPaypalSubscriptionIdCreateMutation>,
    any
  >,
) =>
  graphql.mutation<
    OrganizationPaypalSubscriptionIdCreateMutation,
    OrganizationPaypalSubscriptionIdCreateMutationVariables
  >('organizationPaypalSubscriptionIdCreate', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockOrganizationQuery((req, res, ctx) => {
 *   const { organizationId } = req.variables;
 *   return res(
 *     ctx.data({ organization })
 *   )
 * })
 */
export const mockOrganizationQuery = (
  resolver: ResponseResolver<GraphQLRequest<OrganizationQueryVariables>, GraphQLContext<OrganizationQuery>, any>,
) => graphql.query<OrganizationQuery, OrganizationQueryVariables>('organization', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockOrganizationUpdateMutation((req, res, ctx) => {
 *   const { id, data } = req.variables;
 *   return res(
 *     ctx.data({ organizationUpdate })
 *   )
 * })
 */
export const mockOrganizationUpdateMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<OrganizationUpdateMutationVariables>,
    GraphQLContext<OrganizationUpdateMutation>,
    any
  >,
) => graphql.mutation<OrganizationUpdateMutation, OrganizationUpdateMutationVariables>('organizationUpdate', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockMyOrganizationsQuery((req, res, ctx) => {
 *   const { filter } = req.variables;
 *   return res(
 *     ctx.data({ organizations })
 *   )
 * })
 */
export const mockMyOrganizationsQuery = (
  resolver: ResponseResolver<GraphQLRequest<MyOrganizationsQueryVariables>, GraphQLContext<MyOrganizationsQuery>, any>,
) => graphql.query<MyOrganizationsQuery, MyOrganizationsQueryVariables>('myOrganizations', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockOrganizationCountsQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ organizationsCount, organizationsCount, organizationsCount })
 *   )
 * })
 */
export const mockOrganizationCountsQuery = (
  resolver: ResponseResolver<
    GraphQLRequest<OrganizationCountsQueryVariables>,
    GraphQLContext<OrganizationCountsQuery>,
    any
  >,
) => graphql.query<OrganizationCountsQuery, OrganizationCountsQueryVariables>('organizationCounts', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockOrganizationCreateMutation((req, res, ctx) => {
 *   const { data } = req.variables;
 *   return res(
 *     ctx.data({ organizationCreate })
 *   )
 * })
 */
export const mockOrganizationCreateMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<OrganizationCreateMutationVariables>,
    GraphQLContext<OrganizationCreateMutation>,
    any
  >,
) => graphql.mutation<OrganizationCreateMutation, OrganizationCreateMutationVariables>('organizationCreate', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockProjectQuery((req, res, ctx) => {
 *   const { projectId } = req.variables;
 *   return res(
 *     ctx.data({ project, organizations })
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
 *     ctx.data({ projectsCount, projectsCount, projectsCount, projectsCount, projectsCount })
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
 * mockProjectMembershipJoinMutation((req, res, ctx) => {
 *   const { invitationKey } = req.variables;
 *   return res(
 *     ctx.data({ projectMembershipJoin })
 *   )
 * })
 */
export const mockProjectMembershipJoinMutation = (
  resolver: ResponseResolver<
    GraphQLRequest<ProjectMembershipJoinMutationVariables>,
    GraphQLContext<ProjectMembershipJoinMutation>,
    any
  >,
) =>
  graphql.mutation<ProjectMembershipJoinMutation, ProjectMembershipJoinMutationVariables>(
    'projectMembershipJoin',
    resolver,
  )

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
 * mockOrganizationsQuery((req, res, ctx) => {
 *   return res(
 *     ctx.data({ organizations })
 *   )
 * })
 */
export const mockOrganizationsQuery = (
  resolver: ResponseResolver<GraphQLRequest<OrganizationsQueryVariables>, GraphQLContext<OrganizationsQuery>, any>,
) => graphql.query<OrganizationsQuery, OrganizationsQueryVariables>('organizations', resolver)

/**
 * @param resolver a function that accepts a captured request and may return a mocked response.
 * @see https://mswjs.io/docs/basics/response-resolver
 * @example
 * mockWeekGridQuery((req, res, ctx) => {
 *   const { from, to } = req.variables;
 *   return res(
 *     ctx.data({ projects })
 *   )
 * })
 */
export const mockWeekGridQuery = (
  resolver: ResponseResolver<GraphQLRequest<WeekGridQueryVariables>, GraphQLContext<WeekGridQuery>, any>,
) => graphql.query<WeekGridQuery, WeekGridQueryVariables>('weekGrid', resolver)
