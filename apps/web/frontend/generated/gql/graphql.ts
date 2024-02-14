/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: string;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: string;
};

export type AccessToken = {
  __typename?: 'AccessToken';
  /** Date when the access token was created */
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

/** Adds the information whether the user can edit the entity */
export type ModifyInterface = {
  /** Can the user modify the entity */
  canModify: Scalars['Boolean'];
};

export type MonthInput = {
  month: Scalars['Int'];
  year: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create an access token for the signed in user */
  accessTokenCreate: Scalars['String'];
  /** Delete an access token for the signed in user */
  accessTokenDelete: AccessToken;
  /** Archive a project */
  projectArchive: Project;
  /** Create a new project */
  projectCreate: Project;
  /** Delete a project */
  projectDelete: Project;
  projectLock: Project;
  /** Assign user to a project. This mutation can also be used for updating the role of a project member */
  projectMembershipCreate: Project;
  /** Unassign user from a project */
  projectMembershipDelete: Project;
  /** Assign user to a project by e-mail. */
  projectMembershipInviteByEmail: MutationProjectMembershipInviteByEmailResult;
  /** Add a user to a project using the invite key. */
  projectMembershipJoin: Project;
  /** Regenerate the invite key of a project. The old key will be outdated. */
  projectRegenerateInviteKey: Project;
  /** Unarchive a project */
  projectUnarchive: Project;
  projectUnlock: Project;
  /** Update a project */
  projectUpdate: Project;
  /** Archive a task */
  taskArchive: Task;
  /** Create a new Task */
  taskCreate: Task;
  /** Delete a task */
  taskDelete: Task;
  /** Update a task */
  taskUpdate: Task;
  /** The ongoing time tracking will be deleted */
  trackingCancel?: Maybe<Tracking>;
  /** Start time tracking for a task. When a tracking for the same task is already running the tracking keeps untouched. When a tracking for a different task is running, the on going tracking will be stopped and converted to work hours. */
  trackingStart: Tracking;
  /** The ongoing time tracking will be stopped and converted to work hours */
  trackingStop: Array<WorkHour>;
  /** Create a new WorkHour */
  workHourCreate: WorkHour;
  /** Delete a work hour entry */
  workHourDelete: WorkHour;
  /** Updates a work hour entry or creates if work hour does not exist */
  workHourUpdate: WorkHour;
};


export type MutationAccessTokenCreateArgs = {
  name: Scalars['String'];
};


export type MutationAccessTokenDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationProjectArchiveArgs = {
  projectId: Scalars['ID'];
};


export type MutationProjectCreateArgs = {
  data: ProjectInput;
};


export type MutationProjectDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationProjectLockArgs = {
  date: MonthInput;
  projectId: Scalars['ID'];
};


export type MutationProjectMembershipCreateArgs = {
  projectId: Scalars['ID'];
  role?: Role;
  userId: Scalars['ID'];
};


export type MutationProjectMembershipDeleteArgs = {
  projectId: Scalars['ID'];
  userId: Scalars['ID'];
};


export type MutationProjectMembershipInviteByEmailArgs = {
  email: Scalars['String'];
  projectId: Scalars['ID'];
};


export type MutationProjectMembershipJoinArgs = {
  inviteKey: Scalars['String'];
};


export type MutationProjectRegenerateInviteKeyArgs = {
  projectId: Scalars['ID'];
};


export type MutationProjectUnarchiveArgs = {
  projectId: Scalars['ID'];
};


export type MutationProjectUnlockArgs = {
  date: MonthInput;
  projectId: Scalars['ID'];
};


export type MutationProjectUpdateArgs = {
  data: ProjectInput;
  id: Scalars['ID'];
};


export type MutationTaskArchiveArgs = {
  taskId: Scalars['ID'];
};


export type MutationTaskCreateArgs = {
  data: TaskInput;
};


export type MutationTaskDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationTaskUpdateArgs = {
  data: TaskUpdateInput;
  id: Scalars['ID'];
};


export type MutationTrackingStartArgs = {
  taskId: Scalars['ID'];
};


export type MutationWorkHourCreateArgs = {
  data: WorkHourInput;
};


export type MutationWorkHourDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationWorkHourUpdateArgs = {
  data: WorkHourInput;
  date: Scalars['Date'];
  taskId: Scalars['ID'];
};

export type MutationProjectMembershipInviteByEmailResult = MutationProjectMembershipInviteByEmailSuccess | UserNotFoundError;

export type MutationProjectMembershipInviteByEmailSuccess = {
  __typename?: 'MutationProjectMembershipInviteByEmailSuccess';
  data: Project;
};

export type Project = ModifyInterface & {
  __typename?: 'Project';
  /** Can the user modify the entity */
  canModify: Scalars['Boolean'];
  endDate?: Maybe<Scalars['Date']>;
  hasWorkHours: Scalars['Boolean'];
  /** identifies the project */
  id: Scalars['ID'];
  inviteKey: Scalars['String'];
  isArchived: Scalars['Boolean'];
  /** Is the project locked for the given month */
  isLocked: Scalars['Boolean'];
  /** Is the user member of the project */
  isProjectMember: Scalars['Boolean'];
  /** List of users that are member of the project */
  members: Array<User>;
  /** Can the user modify the entity */
  role: Scalars['String'];
  startDate?: Maybe<Scalars['Date']>;
  /** List of tasks that belong to the project. When the user is no longer a member of the project, only the tasks that the user booked work hours on are returned. */
  tasks: Array<Task>;
  title: Scalars['String'];
};


export type ProjectIsLockedArgs = {
  date?: InputMaybe<MonthInput>;
};


export type ProjectMembersArgs = {
  includePastMembers?: Scalars['Boolean'];
};


export type ProjectTasksArgs = {
  showArchived?: Scalars['Boolean'];
};

export enum ProjectFilter {
  Active = 'ACTIVE',
  ActiveOrArchived = 'ACTIVE_OR_ARCHIVED',
  All = 'ALL',
  Archived = 'ARCHIVED',
  Future = 'FUTURE',
  Past = 'PAST'
}

export type ProjectInput = {
  end?: InputMaybe<Scalars['Date']>;
  start?: InputMaybe<Scalars['Date']>;
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  /** List of tokens of the signed in user */
  accessTokens: Array<AccessToken>;
  currentTracking?: Maybe<Tracking>;
  /** Returns a single project */
  project: Project;
  /** Returns all project of the signed in user that are active */
  projects: Array<Project>;
  projectsCount: Scalars['Int'];
  /** Returns a monthly project report */
  report: Report;
  /** Returns a single task */
  task: Task;
  /** Returns a single user */
  user: User;
  /** Returns a list of work hours for a given time period and a list of users */
  workHours: Array<WorkHour>;
};


export type QueryProjectArgs = {
  projectId: Scalars['ID'];
};


export type QueryProjectsArgs = {
  filter?: ProjectFilter;
  from: Scalars['Date'];
  includeProjectsWhereUserBookedWorkHours?: Scalars['Boolean'];
  to?: InputMaybe<Scalars['Date']>;
};


export type QueryProjectsCountArgs = {
  filter: ProjectFilter;
  from: Scalars['Date'];
  to?: InputMaybe<Scalars['Date']>;
};


export type QueryReportArgs = {
  month: Scalars['Int'];
  projectId: Scalars['ID'];
  userId?: InputMaybe<Scalars['ID']>;
  year: Scalars['Int'];
};


export type QueryTaskArgs = {
  taskId: Scalars['ID'];
};


export type QueryUserArgs = {
  userId?: InputMaybe<Scalars['ID']>;
};


export type QueryWorkHoursArgs = {
  from: Scalars['Date'];
  to?: InputMaybe<Scalars['Date']>;
  userIds?: InputMaybe<Array<Scalars['ID']>>;
};

export type Report = {
  __typename?: 'Report';
  groupedByDate: Array<ReportGroupedByDate>;
  groupedByTask: Array<ReportGroupedByTask>;
  groupedByUser: Array<ReportGroupedByUser>;
  /** If set to true the work hours can not be updated */
  isLocked: Scalars['Boolean'];
};

export type ReportGroupedByDate = {
  __typename?: 'ReportGroupedByDate';
  /** Booking date of the work hour */
  date: Scalars['Date'];
  /** Sum of the total duration of all the work hours for the specific date */
  duration: Scalars['Int'];
  workHours: Array<WorkHour>;
};

export type ReportGroupedByTask = {
  __typename?: 'ReportGroupedByTask';
  /** Sum of the total duration of all the work hours for the task */
  duration: Scalars['Int'];
  task: Task;
  workHours: Array<WorkHour>;
};

export type ReportGroupedByUser = {
  __typename?: 'ReportGroupedByUser';
  /** Sum of the total duration of all the work hours for a specific user */
  duration: Scalars['Int'];
  user: User;
  workHours: Array<WorkHour>;
};

/** Roles a user can have in a team */
export enum Role {
  Admin = 'ADMIN',
  Member = 'MEMBER'
}

export type Task = ModifyInterface & {
  __typename?: 'Task';
  archived: Scalars['Boolean'];
  /** Can the user modify the entity */
  canModify: Scalars['Boolean'];
  hasWorkHours: Scalars['Boolean'];
  /** Identifies the task */
  id: Scalars['ID'];
  isLocked: Scalars['Boolean'];
  /** Is the task locked by an admin */
  isLockedByAdmin: Scalars['Boolean'];
  project: Project;
  /** The user can identify the task in the UI */
  title: Scalars['String'];
  tracking?: Maybe<Tracking>;
  /** The work hours of the task for each day of the given interval */
  workHourOfDays: Array<WorkHourOfDay>;
  workHours: Array<WorkHour>;
};


export type TaskWorkHourOfDaysArgs = {
  from: Scalars['Date'];
  to?: InputMaybe<Scalars['Date']>;
};


export type TaskWorkHoursArgs = {
  from: Scalars['Date'];
  to?: InputMaybe<Scalars['Date']>;
};

export type TaskInput = {
  isLocked?: InputMaybe<Scalars['Boolean']>;
  projectId: Scalars['ID'];
  title: Scalars['String'];
};

export type TaskUpdateInput = {
  isLocked?: InputMaybe<Scalars['Boolean']>;
  projectId?: InputMaybe<Scalars['ID']>;
  title?: InputMaybe<Scalars['String']>;
};

export type Tracking = {
  __typename?: 'Tracking';
  start: Scalars['DateTime'];
  task: Task;
};

export type User = {
  __typename?: 'User';
  durationWorkedOnProject: Scalars['Int'];
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  /** Role of the user in a project */
  role: Role;
};


export type UserDurationWorkedOnProjectArgs = {
  from: Scalars['Date'];
  projectId: Scalars['ID'];
  to?: InputMaybe<Scalars['Date']>;
};


export type UserRoleArgs = {
  projectId: Scalars['ID'];
};

export type UserNotFoundError = {
  __typename?: 'UserNotFoundError';
  email: Scalars['String'];
};

export type WorkHour = {
  __typename?: 'WorkHour';
  date: Scalars['Date'];
  /** Duration of the work hour in minutes */
  duration: Scalars['Int'];
  /** Identifies the work hour */
  id: Scalars['ID'];
  project: Project;
  /** Task for which the working hour was booked */
  task: Task;
  /** User who booked the work hours */
  user: User;
};

export type WorkHourInput = {
  date: Scalars['Date'];
  /** Duration of the work hour in minutes */
  duration: Scalars['Int'];
  taskId: Scalars['ID'];
};

export type WorkHourOfDay = {
  __typename?: 'WorkHourOfDay';
  date: Scalars['Date'];
  isLocked: Scalars['Boolean'];
  workHour?: Maybe<WorkHour>;
};

export type AccessTokenRowFragment = { __typename?: 'AccessToken', id: string, name: string, createdAt: string } & { ' $fragmentName'?: 'AccessTokenRowFragment' };

export type AccessTokenDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type AccessTokenDeleteMutation = { __typename?: 'Mutation', accessTokenDelete: { __typename?: 'AccessToken', id: string } };

export type AddProjectMemberFormFragment = { __typename?: 'Project', id: string, inviteKey: string, title: string } & { ' $fragmentName'?: 'AddProjectMemberFormFragment' };

export type ProjectMembershipInviteByEmailMutationVariables = Exact<{
  email: Scalars['String'];
  projectId: Scalars['ID'];
}>;


export type ProjectMembershipInviteByEmailMutation = { __typename?: 'Mutation', projectMembershipInviteByEmail: { __typename: 'MutationProjectMembershipInviteByEmailSuccess', data: { __typename?: 'Project', title: string, members: Array<{ __typename?: 'User', name?: string | null }> } } | { __typename: 'UserNotFoundError', email: string } };

export type DeleteTaskButtonFragment = { __typename?: 'Task', id: string, hasWorkHours: boolean, title: string } & { ' $fragmentName'?: 'DeleteTaskButtonFragment' };

export type TaskDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
  hasWorkHours: Scalars['Boolean'];
}>;


export type TaskDeleteMutation = { __typename?: 'Mutation', taskDelete?: { __typename?: 'Task', id: string }, taskArchive?: { __typename?: 'Task', id: string } };

export type InviteLinkProjectFragmentFragment = { __typename?: 'Project', id: string, inviteKey: string } & { ' $fragmentName'?: 'InviteLinkProjectFragmentFragment' };

export type ProjectRegenerateInviteKeyMutationVariables = Exact<{
  projectId: Scalars['ID'];
}>;


export type ProjectRegenerateInviteKeyMutation = { __typename?: 'Mutation', projectRegenerateInviteKey: { __typename?: 'Project', title: string, inviteKey: string } };

export type LockTaskButtonFragment = { __typename?: 'Task', id: string, isLockedByAdmin: boolean } & { ' $fragmentName'?: 'LockTaskButtonFragment' };

export type TaskUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  data: TaskUpdateInput;
}>;


export type TaskUpdateMutation = { __typename?: 'Mutation', taskUpdate: { __typename?: 'Task', id: string } };

export type ArchiveProjectButtonFragment = { __typename?: 'Project', id: string, title: string } & { ' $fragmentName'?: 'ArchiveProjectButtonFragment' };

export type ProjectArchiveMutationVariables = Exact<{
  projectId: Scalars['ID'];
}>;


export type ProjectArchiveMutation = { __typename?: 'Mutation', projectArchive: { __typename?: 'Project', id: string, isArchived: boolean } };

export type DeleteOrArchiveProjectButtonFragment = (
  { __typename?: 'Project', id: string, hasWorkHours: boolean, isArchived: boolean }
  & { ' $fragmentRefs'?: { 'DeleteProjectButtonFragment': DeleteProjectButtonFragment;'UnarchiveProjectButtonFragment': UnarchiveProjectButtonFragment;'ArchiveProjectButtonFragment': ArchiveProjectButtonFragment } }
) & { ' $fragmentName'?: 'DeleteOrArchiveProjectButtonFragment' };

export type DeleteProjectButtonFragment = { __typename?: 'Project', id: string, title: string } & { ' $fragmentName'?: 'DeleteProjectButtonFragment' };

export type ProjectDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ProjectDeleteMutation = { __typename?: 'Mutation', projectDelete: { __typename?: 'Project', id: string } };

export type UnarchiveProjectButtonFragment = { __typename?: 'Project', id: string, title: string } & { ' $fragmentName'?: 'UnarchiveProjectButtonFragment' };

export type ProjectUnarchiveMutationVariables = Exact<{
  projectId: Scalars['ID'];
}>;


export type ProjectUnarchiveMutation = { __typename?: 'Mutation', projectUnarchive: { __typename?: 'Project', id: string, isArchived: boolean } };

export type ProjectFormFragment = (
  { __typename?: 'Project', title: string, startDate?: string | null, endDate?: string | null, canModify: boolean, hasWorkHours: boolean }
  & { ' $fragmentRefs'?: { 'DeleteOrArchiveProjectButtonFragment': DeleteOrArchiveProjectButtonFragment } }
) & { ' $fragmentName'?: 'ProjectFormFragment' };

export type ProjectMemberListProjectFragment = (
  { __typename?: 'Project', id: string, canModify: boolean, members: Array<(
    { __typename?: 'User', id: string, image?: string | null, name?: string | null, role: Role }
    & { ' $fragmentRefs'?: { 'RemoveUserFromProjectButtonUserFragment': RemoveUserFromProjectButtonUserFragment } }
  )> }
  & { ' $fragmentRefs'?: { 'RemoveUserFromProjectButtonProjectFragment': RemoveUserFromProjectButtonProjectFragment;'AddProjectMemberFormFragment': AddProjectMemberFormFragment;'InviteLinkProjectFragmentFragment': InviteLinkProjectFragmentFragment } }
) & { ' $fragmentName'?: 'ProjectMemberListProjectFragment' };

export type ProjectMembershipUpdateMutationVariables = Exact<{
  projectId: Scalars['ID'];
  userId: Scalars['ID'];
  role: Role;
}>;


export type ProjectMembershipUpdateMutation = { __typename?: 'Mutation', projectMembershipCreate: { __typename?: 'Project', id: string } };

export type RemoveUserFromProjectButtonUserFragment = { __typename?: 'User', id: string, name?: string | null } & { ' $fragmentName'?: 'RemoveUserFromProjectButtonUserFragment' };

export type RemoveUserFromProjectButtonProjectFragment = { __typename?: 'Project', id: string, title: string } & { ' $fragmentName'?: 'RemoveUserFromProjectButtonProjectFragment' };

export type ProjectMembershipDeleteMutationVariables = Exact<{
  projectId: Scalars['ID'];
  userId: Scalars['ID'];
}>;


export type ProjectMembershipDeleteMutation = { __typename?: 'Mutation', projectMembershipDelete: { __typename?: 'Project', id: string } };

export type ProjectTableItemFragment = { __typename?: 'Project', id: string, title: string, startDate?: string | null, endDate?: string | null, members: Array<{ __typename?: 'User', id: string, image?: string | null, name?: string | null }> } & { ' $fragmentName'?: 'ProjectTableItemFragment' };

export type ProjectLockMutationVariables = Exact<{
  date: MonthInput;
  projectId: Scalars['ID'];
}>;


export type ProjectLockMutation = { __typename?: 'Mutation', projectLock: { __typename?: 'Project', isLocked: boolean } };

export type ProjectUnlockMutationVariables = Exact<{
  date: MonthInput;
  projectId: Scalars['ID'];
}>;


export type ProjectUnlockMutation = { __typename?: 'Mutation', projectUnlock: { __typename?: 'Project', isLocked: boolean } };

export type ReportProjectFragment = { __typename?: 'Project', id: string, title: string, role: string, canModify: boolean, isArchived: boolean, isLocked: boolean } & { ' $fragmentName'?: 'ReportProjectFragment' };

export type ReportProjectsQueryVariables = Exact<{
  from: Scalars['Date'];
  to?: InputMaybe<Scalars['Date']>;
  filter?: InputMaybe<ProjectFilter>;
  date: MonthInput;
}>;


export type ReportProjectsQuery = { __typename?: 'Query', projects: Array<(
    { __typename?: 'Project' }
    & { ' $fragmentRefs'?: { 'ReportProjectFragment': ReportProjectFragment } }
  )> };

export type ReportQueryVariables = Exact<{
  projectId: Scalars['ID'];
  month: Scalars['Int'];
  year: Scalars['Int'];
  userId?: InputMaybe<Scalars['ID']>;
  groupByUser: Scalars['Boolean'];
}>;


export type ReportQuery = { __typename?: 'Query', project: { __typename?: 'Project', canModify: boolean }, report: { __typename?: 'Report', groupedByDate: Array<{ __typename?: 'ReportGroupedByDate', date: string, duration: number, workHours: Array<{ __typename?: 'WorkHour', id: string, duration: number, user: { __typename?: 'User', name?: string | null }, task: { __typename?: 'Task', title: string } }> }>, groupedByTask: Array<{ __typename?: 'ReportGroupedByTask', duration: number, task: { __typename?: 'Task', id: string, title: string } }>, groupedByUser?: Array<{ __typename?: 'ReportGroupedByUser', duration: number, user: { __typename?: 'User', id: string, name?: string | null } }> } };

export type ReportUserFragment = { __typename?: 'User', id: string, name?: string | null, durationWorkedOnProject: number } & { ' $fragmentName'?: 'ReportUserFragment' };

export type ReportUsersQueryVariables = Exact<{
  projectId: Scalars['ID'];
  from: Scalars['Date'];
  to: Scalars['Date'];
}>;


export type ReportUsersQuery = { __typename?: 'Query', project: { __typename?: 'Project', id: string, members: Array<(
      { __typename?: 'User' }
      & { ' $fragmentRefs'?: { 'ReportUserFragment': ReportUserFragment } }
    )> } };

export type TaskListProjectFragment = { __typename?: 'Project', id: string, canModify: boolean, tasks: Array<(
    { __typename?: 'Task', id: string }
    & { ' $fragmentRefs'?: { 'TaskRowFragment': TaskRowFragment } }
  )> } & { ' $fragmentName'?: 'TaskListProjectFragment' };

export type TaskCreateMutationVariables = Exact<{
  data: TaskInput;
}>;


export type TaskCreateMutation = { __typename?: 'Mutation', taskCreate: { __typename?: 'Task', id: string } };

export type TaskRowFragment = (
  { __typename?: 'Task', id: string, title: string, canModify: boolean, isLockedByAdmin: boolean }
  & { ' $fragmentRefs'?: { 'DeleteTaskButtonFragment': DeleteTaskButtonFragment;'LockTaskButtonFragment': LockTaskButtonFragment } }
) & { ' $fragmentName'?: 'TaskRowFragment' };

export type SheetDayRowFragment = { __typename?: 'WorkHour', id: string, duration: number, project: { __typename?: 'Project', title: string }, task: { __typename?: 'Task', title: string }, user: { __typename?: 'User', name?: string | null } } & { ' $fragmentName'?: 'SheetDayRowFragment' };

export type WorkHoursQueryVariables = Exact<{
  from: Scalars['Date'];
  to?: InputMaybe<Scalars['Date']>;
}>;


export type WorkHoursQuery = { __typename?: 'Query', workHours: Array<(
    { __typename?: 'WorkHour', date: string }
    & { ' $fragmentRefs'?: { 'SheetDayRowFragment': SheetDayRowFragment } }
  )> };

export type CurrentTrackingQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentTrackingQuery = { __typename?: 'Query', currentTracking?: (
    { __typename?: 'Tracking', start: string, task: { __typename?: 'Task', title: string, project: { __typename?: 'Project', title: string } } }
    & { ' $fragmentRefs'?: { 'TrackingButtonsTrackingFragment': TrackingButtonsTrackingFragment } }
  ) | null };

export type TrackingButtonsTrackingFragment = { __typename?: 'Tracking', start: string, task: { __typename?: 'Task', id: string, title: string, project: { __typename?: 'Project', title: string } } } & { ' $fragmentName'?: 'TrackingButtonsTrackingFragment' };

export type TrackingButtonsTaskFragment = { __typename?: 'Task', id: string, isLocked: boolean } & { ' $fragmentName'?: 'TrackingButtonsTaskFragment' };

export type TrackingStartMutationVariables = Exact<{
  taskId: Scalars['ID'];
}>;


export type TrackingStartMutation = { __typename?: 'Mutation', trackingStart: { __typename?: 'Tracking', start: string, task: { __typename?: 'Task', id: string } } };

export type TrackingStopMutationVariables = Exact<{ [key: string]: never; }>;


export type TrackingStopMutation = { __typename?: 'Mutation', trackingStop: Array<{ __typename?: 'WorkHour', id: string, task: { __typename?: 'Task', id: string } }> };

export type TrackingCancelMutationVariables = Exact<{ [key: string]: never; }>;


export type TrackingCancelMutation = { __typename?: 'Mutation', trackingCancel?: { __typename?: 'Tracking', start: string, task: { __typename?: 'Task', id: string } } | null };

export type WeekGridProjectFragment = (
  { __typename?: 'Project', id: string, tasks: Array<{ __typename?: 'Task', workHourOfDays: Array<(
      { __typename?: 'WorkHourOfDay', workHour?: { __typename?: 'WorkHour', duration: number } | null }
      & { ' $fragmentRefs'?: { 'WeekGridFooterFragment': WeekGridFooterFragment } }
    )> }> }
  & { ' $fragmentRefs'?: { 'WeekGridProjectRowGroupFragment': WeekGridProjectRowGroupFragment } }
) & { ' $fragmentName'?: 'WeekGridProjectFragment' };

export type WeekGridFooterFragment = { __typename?: 'WorkHourOfDay', date: string, workHour?: { __typename?: 'WorkHour', duration: number } | null } & { ' $fragmentName'?: 'WeekGridFooterFragment' };

export type WeekGridProjectRowGroupFragment = { __typename?: 'Project', id: string, title: string, isArchived: boolean, tasks: Array<(
    { __typename?: 'Task', id: string, workHourOfDays: Array<{ __typename?: 'WorkHourOfDay', workHour?: { __typename?: 'WorkHour', duration: number } | null }> }
    & { ' $fragmentRefs'?: { 'WeekGridTaskRowFragment': WeekGridTaskRowFragment } }
  )> } & { ' $fragmentName'?: 'WeekGridProjectRowGroupFragment' };

export type WorkHourUpdateMutationVariables = Exact<{
  data: WorkHourInput;
  date: Scalars['Date'];
  taskId: Scalars['ID'];
}>;


export type WorkHourUpdateMutation = { __typename?: 'Mutation', workHourUpdate: { __typename?: 'WorkHour', id: string } };

export type WeekGridTaskRowFragment = (
  { __typename?: 'Task', id: string, title: string, isLockedByAdmin: boolean, project: { __typename?: 'Project', startDate?: string | null, endDate?: string | null, id: string, isProjectMember: boolean, isArchived: boolean }, workHourOfDays: Array<{ __typename?: 'WorkHourOfDay', date: string, isLocked: boolean, workHour?: { __typename?: 'WorkHour', duration: number } | null }>, tracking?: (
    { __typename?: 'Tracking' }
    & { ' $fragmentRefs'?: { 'TrackingButtonsTrackingFragment': TrackingButtonsTrackingFragment } }
  ) | null }
  & { ' $fragmentRefs'?: { 'TrackingButtonsTaskFragment': TrackingButtonsTaskFragment } }
) & { ' $fragmentName'?: 'WeekGridTaskRowFragment' };

export type AccessTokensQueryVariables = Exact<{ [key: string]: never; }>;


export type AccessTokensQuery = { __typename?: 'Query', accessTokens: Array<(
    { __typename?: 'AccessToken', id: string }
    & { ' $fragmentRefs'?: { 'AccessTokenRowFragment': AccessTokenRowFragment } }
  )> };

export type AccessTokenCreateMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type AccessTokenCreateMutation = { __typename?: 'Mutation', accessTokenCreate: string };

export type ProjectQueryVariables = Exact<{
  projectId: Scalars['ID'];
}>;


export type ProjectQuery = { __typename?: 'Query', project: (
    { __typename?: 'Project', id: string }
    & { ' $fragmentRefs'?: { 'TaskListProjectFragment': TaskListProjectFragment;'ProjectFormFragment': ProjectFormFragment;'ProjectMemberListProjectFragment': ProjectMemberListProjectFragment } }
  ) };

export type ProjectUpdateMutationVariables = Exact<{
  id: Scalars['ID'];
  data: ProjectInput;
}>;


export type ProjectUpdateMutation = { __typename?: 'Mutation', projectUpdate: { __typename?: 'Project', id: string } };

export type MyProjectsQueryVariables = Exact<{
  from: Scalars['Date'];
  filter?: InputMaybe<ProjectFilter>;
}>;


export type MyProjectsQuery = { __typename?: 'Query', projects: Array<(
    { __typename?: 'Project' }
    & { ' $fragmentRefs'?: { 'ProjectTableItemFragment': ProjectTableItemFragment } }
  )> };

export type ProjectCountsQueryVariables = Exact<{
  from: Scalars['Date'];
  to?: InputMaybe<Scalars['Date']>;
}>;


export type ProjectCountsQuery = { __typename?: 'Query', allCounts: number, activeCounts: number, futureCounts: number, pastCounts: number, archivedCounts: number };

export type ProjectMembershipJoinMutationVariables = Exact<{
  inviteKey: Scalars['String'];
}>;


export type ProjectMembershipJoinMutation = { __typename?: 'Mutation', projectMembershipJoin: { __typename?: 'Project', id: string } };

export type ProjectCreateMutationVariables = Exact<{
  data: ProjectInput;
}>;


export type ProjectCreateMutation = { __typename?: 'Mutation', projectCreate: { __typename?: 'Project', id: string } };

export type WeekGridQueryVariables = Exact<{
  from: Scalars['Date'];
  to?: InputMaybe<Scalars['Date']>;
}>;


export type WeekGridQuery = { __typename?: 'Query', projects: Array<(
    { __typename?: 'Project' }
    & { ' $fragmentRefs'?: { 'WeekGridProjectFragment': WeekGridProjectFragment } }
  )> };

export const AccessTokenRowFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccessTokenRow"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AccessToken"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<AccessTokenRowFragment, unknown>;
export const DeleteProjectButtonFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteProjectButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<DeleteProjectButtonFragment, unknown>;
export const UnarchiveProjectButtonFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UnarchiveProjectButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<UnarchiveProjectButtonFragment, unknown>;
export const ArchiveProjectButtonFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArchiveProjectButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<ArchiveProjectButtonFragment, unknown>;
export const DeleteOrArchiveProjectButtonFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteOrArchiveProjectButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hasWorkHours"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeleteProjectButton"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UnarchiveProjectButton"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArchiveProjectButton"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteProjectButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UnarchiveProjectButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArchiveProjectButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<DeleteOrArchiveProjectButtonFragment, unknown>;
export const ProjectFormFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectForm"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"canModify"}},{"kind":"Field","name":{"kind":"Name","value":"hasWorkHours"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeleteOrArchiveProjectButton"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteProjectButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UnarchiveProjectButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArchiveProjectButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteOrArchiveProjectButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hasWorkHours"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeleteProjectButton"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UnarchiveProjectButton"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArchiveProjectButton"}}]}}]} as unknown as DocumentNode<ProjectFormFragment, unknown>;
export const RemoveUserFromProjectButtonProjectFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RemoveUserFromProjectButtonProject"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<RemoveUserFromProjectButtonProjectFragment, unknown>;
export const AddProjectMemberFormFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AddProjectMemberForm"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inviteKey"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<AddProjectMemberFormFragment, unknown>;
export const RemoveUserFromProjectButtonUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RemoveUserFromProjectButtonUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<RemoveUserFromProjectButtonUserFragment, unknown>;
export const InviteLinkProjectFragmentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InviteLinkProjectFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inviteKey"}}]}}]} as unknown as DocumentNode<InviteLinkProjectFragmentFragment, unknown>;
export const ProjectMemberListProjectFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectMemberListProject"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"canModify"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RemoveUserFromProjectButtonProject"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AddProjectMemberForm"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RemoveUserFromProjectButtonUser"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"InviteLinkProjectFragment"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RemoveUserFromProjectButtonProject"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AddProjectMemberForm"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inviteKey"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RemoveUserFromProjectButtonUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InviteLinkProjectFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inviteKey"}}]}}]} as unknown as DocumentNode<ProjectMemberListProjectFragment, unknown>;
export const ProjectTableItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectTableItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ProjectTableItemFragment, unknown>;
export const ReportProjectFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportProject"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"canModify"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}]}]}}]} as unknown as DocumentNode<ReportProjectFragment, unknown>;
export const ReportUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"durationWorkedOnProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}]}]}}]} as unknown as DocumentNode<ReportUserFragment, unknown>;
export const DeleteTaskButtonFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteTaskButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hasWorkHours"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<DeleteTaskButtonFragment, unknown>;
export const LockTaskButtonFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LockTaskButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isLockedByAdmin"}}]}}]} as unknown as DocumentNode<LockTaskButtonFragment, unknown>;
export const TaskRowFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskRow"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"canModify"}},{"kind":"Field","name":{"kind":"Name","value":"isLockedByAdmin"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeleteTaskButton"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"LockTaskButton"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteTaskButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hasWorkHours"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LockTaskButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isLockedByAdmin"}}]}}]} as unknown as DocumentNode<TaskRowFragment, unknown>;
export const TaskListProjectFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskListProject"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"canModify"}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskRow"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteTaskButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hasWorkHours"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LockTaskButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isLockedByAdmin"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskRow"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"canModify"}},{"kind":"Field","name":{"kind":"Name","value":"isLockedByAdmin"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeleteTaskButton"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"LockTaskButton"}}]}}]} as unknown as DocumentNode<TaskListProjectFragment, unknown>;
export const SheetDayRowFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SheetDayRow"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WorkHour"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<SheetDayRowFragment, unknown>;
export const WeekGridFooterFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WeekGridFooter"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WorkHourOfDay"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"workHour"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]} as unknown as DocumentNode<WeekGridFooterFragment, unknown>;
export const TrackingButtonsTrackingFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackingButtonsTracking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tracking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<TrackingButtonsTrackingFragment, unknown>;
export const TrackingButtonsTaskFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackingButtonsTask"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}}]}}]} as unknown as DocumentNode<TrackingButtonsTaskFragment, unknown>;
export const WeekGridTaskRowFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WeekGridTaskRow"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workHourOfDays"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"workHour"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}}]}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isProjectMember"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tracking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackingButtonsTracking"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isLockedByAdmin"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackingButtonsTask"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackingButtonsTracking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tracking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackingButtonsTask"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}}]}}]} as unknown as DocumentNode<WeekGridTaskRowFragment, unknown>;
export const WeekGridProjectRowGroupFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WeekGridProjectRowGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"WeekGridTaskRow"}},{"kind":"Field","name":{"kind":"Name","value":"workHourOfDays"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workHour"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackingButtonsTracking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tracking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackingButtonsTask"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WeekGridTaskRow"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workHourOfDays"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"workHour"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}}]}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isProjectMember"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tracking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackingButtonsTracking"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isLockedByAdmin"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackingButtonsTask"}}]}}]} as unknown as DocumentNode<WeekGridProjectRowGroupFragment, unknown>;
export const WeekGridProjectFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WeekGridProject"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workHourOfDays"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WeekGridFooter"}},{"kind":"Field","name":{"kind":"Name","value":"workHour"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"WeekGridProjectRowGroup"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackingButtonsTracking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tracking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackingButtonsTask"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WeekGridTaskRow"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workHourOfDays"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"workHour"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}}]}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isProjectMember"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tracking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackingButtonsTracking"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isLockedByAdmin"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackingButtonsTask"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WeekGridFooter"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WorkHourOfDay"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"workHour"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WeekGridProjectRowGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"WeekGridTaskRow"}},{"kind":"Field","name":{"kind":"Name","value":"workHourOfDays"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workHour"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]}}]}}]} as unknown as DocumentNode<WeekGridProjectFragment, unknown>;
export const AccessTokenDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"accessTokenDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessTokenDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AccessTokenDeleteMutation, AccessTokenDeleteMutationVariables>;
export const ProjectMembershipInviteByEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"projectMembershipInviteByEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectMembershipInviteByEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"MutationProjectMembershipInviteByEmailSuccess"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"UserNotFoundError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}}]}}]}}]} as unknown as DocumentNode<ProjectMembershipInviteByEmailMutation, ProjectMembershipInviteByEmailMutationVariables>;
export const TaskDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"taskDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"hasWorkHours"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"skip"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hasWorkHours"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"taskArchive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"hasWorkHours"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<TaskDeleteMutation, TaskDeleteMutationVariables>;
export const ProjectRegenerateInviteKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"projectRegenerateInviteKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectRegenerateInviteKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"inviteKey"}}]}}]}}]} as unknown as DocumentNode<ProjectRegenerateInviteKeyMutation, ProjectRegenerateInviteKeyMutationVariables>;
export const TaskUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"taskUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<TaskUpdateMutation, TaskUpdateMutationVariables>;
export const ProjectArchiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"projectArchive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectArchive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}}]}}]}}]} as unknown as DocumentNode<ProjectArchiveMutation, ProjectArchiveMutationVariables>;
export const ProjectDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"projectDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ProjectDeleteMutation, ProjectDeleteMutationVariables>;
export const ProjectUnarchiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"projectUnarchive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectUnarchive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}}]}}]}}]} as unknown as DocumentNode<ProjectUnarchiveMutation, ProjectUnarchiveMutationVariables>;
export const ProjectMembershipUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"projectMembershipUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Role"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectMembershipCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ProjectMembershipUpdateMutation, ProjectMembershipUpdateMutationVariables>;
export const ProjectMembershipDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"projectMembershipDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectMembershipDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ProjectMembershipDeleteMutation, ProjectMembershipDeleteMutationVariables>;
export const ProjectLockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"projectLock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MonthInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectLock"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isLocked"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}]}]}}]}}]} as unknown as DocumentNode<ProjectLockMutation, ProjectLockMutationVariables>;
export const ProjectUnlockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"projectUnlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MonthInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectUnlock"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isLocked"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}]}]}}]}}]} as unknown as DocumentNode<ProjectUnlockMutation, ProjectUnlockMutationVariables>;
export const ReportProjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"reportProjects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProjectFilter"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MonthInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReportProject"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportProject"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"canModify"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}}]}]}}]} as unknown as DocumentNode<ReportProjectsQuery, ReportProjectsQueryVariables>;
export const ReportDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"report"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"month"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"year"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"groupByUser"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canModify"}}]}},{"kind":"Field","name":{"kind":"Name","value":"report"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"month"},"value":{"kind":"Variable","name":{"kind":"Name","value":"month"}}},{"kind":"Argument","name":{"kind":"Name","value":"year"},"value":{"kind":"Variable","name":{"kind":"Name","value":"year"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupedByDate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"workHours"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"groupedByTask"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"groupedByUser"},"directives":[{"kind":"Directive","name":{"kind":"Name","value":"include"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"if"},"value":{"kind":"Variable","name":{"kind":"Name","value":"groupByUser"}}}]}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]}}]} as unknown as DocumentNode<ReportQuery, ReportQueryVariables>;
export const ReportUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"reportUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"includePastMembers"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReportUser"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReportUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"durationWorkedOnProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}]}]}}]} as unknown as DocumentNode<ReportUsersQuery, ReportUsersQueryVariables>;
export const TaskCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"taskCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TaskInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"taskCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<TaskCreateMutation, TaskCreateMutationVariables>;
export const WorkHoursDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"workHours"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workHours"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SheetDayRow"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SheetDayRow"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WorkHour"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"duration"}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<WorkHoursQuery, WorkHoursQueryVariables>;
export const CurrentTrackingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"currentTracking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentTracking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackingButtonsTracking"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackingButtonsTracking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tracking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}}]} as unknown as DocumentNode<CurrentTrackingQuery, CurrentTrackingQueryVariables>;
export const TrackingStartDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"trackingStart"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackingStart"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<TrackingStartMutation, TrackingStartMutationVariables>;
export const TrackingStopDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"trackingStop"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackingStop"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<TrackingStopMutation, TrackingStopMutationVariables>;
export const TrackingCancelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"trackingCancel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trackingCancel"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<TrackingCancelMutation, TrackingCancelMutationVariables>;
export const WorkHourUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"workHourUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WorkHourInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"date"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workHourUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}},{"kind":"Argument","name":{"kind":"Name","value":"date"},"value":{"kind":"Variable","name":{"kind":"Name","value":"date"}}},{"kind":"Argument","name":{"kind":"Name","value":"taskId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"taskId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<WorkHourUpdateMutation, WorkHourUpdateMutationVariables>;
export const AccessTokensDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"accessTokens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessTokens"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AccessTokenRow"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AccessTokenRow"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"AccessToken"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]} as unknown as DocumentNode<AccessTokensQuery, AccessTokensQueryVariables>;
export const AccessTokenCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"accessTokenCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessTokenCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}]}}]} as unknown as DocumentNode<AccessTokenCreateMutation, AccessTokenCreateMutationVariables>;
export const ProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"project"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"project"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskListProject"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectForm"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectMemberListProject"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteTaskButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hasWorkHours"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"LockTaskButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isLockedByAdmin"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskRow"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"canModify"}},{"kind":"Field","name":{"kind":"Name","value":"isLockedByAdmin"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeleteTaskButton"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"LockTaskButton"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteProjectButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UnarchiveProjectButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ArchiveProjectButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeleteOrArchiveProjectButton"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hasWorkHours"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeleteProjectButton"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"UnarchiveProjectButton"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ArchiveProjectButton"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RemoveUserFromProjectButtonProject"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AddProjectMemberForm"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inviteKey"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RemoveUserFromProjectButtonUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"InviteLinkProjectFragment"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"inviteKey"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TaskListProject"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"canModify"}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TaskRow"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectForm"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"canModify"}},{"kind":"Field","name":{"kind":"Name","value":"hasWorkHours"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeleteOrArchiveProjectButton"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectMemberListProject"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"canModify"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RemoveUserFromProjectButtonProject"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"AddProjectMemberForm"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"role"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}]},{"kind":"FragmentSpread","name":{"kind":"Name","value":"RemoveUserFromProjectButtonUser"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"InviteLinkProjectFragment"}}]}}]} as unknown as DocumentNode<ProjectQuery, ProjectQueryVariables>;
export const ProjectUpdateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"projectUpdate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProjectInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectUpdate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ProjectUpdateMutation, ProjectUpdateMutationVariables>;
export const MyProjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myProjects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ProjectFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProjectTableItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProjectTableItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<MyProjectsQuery, MyProjectsQueryVariables>;
export const ProjectCountsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"projectCounts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"allCounts"},"name":{"kind":"Name","value":"projectsCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"ALL"}}]},{"kind":"Field","alias":{"kind":"Name","value":"activeCounts"},"name":{"kind":"Name","value":"projectsCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"ACTIVE"}}]},{"kind":"Field","alias":{"kind":"Name","value":"futureCounts"},"name":{"kind":"Name","value":"projectsCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"FUTURE"}}]},{"kind":"Field","alias":{"kind":"Name","value":"pastCounts"},"name":{"kind":"Name","value":"projectsCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"PAST"}}]},{"kind":"Field","alias":{"kind":"Name","value":"archivedCounts"},"name":{"kind":"Name","value":"projectsCount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"ARCHIVED"}}]}]}}]} as unknown as DocumentNode<ProjectCountsQuery, ProjectCountsQueryVariables>;
export const ProjectMembershipJoinDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"projectMembershipJoin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inviteKey"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectMembershipJoin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"inviteKey"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inviteKey"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ProjectMembershipJoinMutation, ProjectMembershipJoinMutationVariables>;
export const ProjectCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"projectCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"data"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ProjectInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projectCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"data"},"value":{"kind":"Variable","name":{"kind":"Name","value":"data"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ProjectCreateMutation, ProjectCreateMutationVariables>;
export const WeekGridDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"weekGrid"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"to"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"projects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}},{"kind":"Argument","name":{"kind":"Name","value":"includeProjectsWhereUserBookedWorkHours"},"value":{"kind":"BooleanValue","value":true}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WeekGridProject"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WeekGridFooter"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WorkHourOfDay"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"workHour"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackingButtonsTracking"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tracking"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"task"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TrackingButtonsTask"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WeekGridTaskRow"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Task"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workHourOfDays"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"workHour"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isLocked"}}]}},{"kind":"Field","name":{"kind":"Name","value":"project"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isProjectMember"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tracking"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackingButtonsTracking"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isLockedByAdmin"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"TrackingButtonsTask"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WeekGridProjectRowGroup"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"isArchived"}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"WeekGridTaskRow"}},{"kind":"Field","name":{"kind":"Name","value":"workHourOfDays"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workHour"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"WeekGridProject"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Project"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tasks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workHourOfDays"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}},{"kind":"Argument","name":{"kind":"Name","value":"to"},"value":{"kind":"Variable","name":{"kind":"Name","value":"to"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"WeekGridFooter"}},{"kind":"Field","name":{"kind":"Name","value":"workHour"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duration"}}]}}]}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"WeekGridProjectRowGroup"}}]}}]} as unknown as DocumentNode<WeekGridQuery, WeekGridQueryVariables>;