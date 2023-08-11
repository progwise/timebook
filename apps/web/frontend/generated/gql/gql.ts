/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

import * as types from './graphql'

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n  fragment AddProjectMemberForm on Project {\n    id\n    inviteKey\n    title\n  }\n':
    types.AddProjectMemberFormFragmentDoc,
  '\n  mutation projectMembershipInviteByEmail($email: String!, $projectId: ID!) {\n    projectMembershipInviteByEmail(email: $email, projectId: $projectId) {\n      ... on MutationProjectMembershipInviteByEmailSuccess {\n        data {\n          title\n          members {\n            name\n          }\n        }\n      }\n      ... on UserNotFoundError {\n        email\n      }\n      __typename\n    }\n  }\n':
    types.ProjectMembershipInviteByEmailDocument,
  '\n  fragment DeleteTaskModal on Task {\n    id\n    hasWorkHours\n    title\n  }\n':
    types.DeleteTaskModalFragmentDoc,
  '\n  mutation taskDelete($id: ID!, $hasWorkHours: Boolean!) {\n    taskDelete(id: $id) @skip(if: $hasWorkHours) {\n      id\n    }\n    taskArchive(taskId: $id) @include(if: $hasWorkHours) {\n      id\n    }\n  }\n':
    types.TaskDeleteDocument,
  '\n  fragment InviteLinkProjectFragment on Project {\n    id\n    inviteKey\n  }\n':
    types.InviteLinkProjectFragmentFragmentDoc,
  '\n  mutation projectRegenerateInviteKey($projectId: ID!) {\n    projectRegenerateInviteKey(projectId: $projectId) {\n      title\n      inviteKey\n    }\n  }\n':
    types.ProjectRegenerateInviteKeyDocument,
  '\n  fragment ArchiveProjectModal on Project {\n    id\n    title\n  }\n': types.ArchiveProjectModalFragmentDoc,
  '\n  mutation projectArchive($projectId: ID!) {\n    projectArchive(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n':
    types.ProjectArchiveDocument,
  '\n  fragment DeleteOrArchiveProjectButton on Project {\n    id\n    hasWorkHours\n    isArchived\n    ...DeleteProjectModal\n    ...UnarchiveProjectModal\n    ...ArchiveProjectModal\n  }\n':
    types.DeleteOrArchiveProjectButtonFragmentDoc,
  '\n  fragment DeleteProjectModal on Project {\n    id\n    title\n  }\n': types.DeleteProjectModalFragmentDoc,
  '\n  mutation projectDelete($id: ID!) {\n    projectDelete(id: $id) {\n      id\n    }\n  }\n':
    types.ProjectDeleteDocument,
  '\n  fragment UnarchiveProjectModal on Project {\n    id\n    title\n  }\n': types.UnarchiveProjectModalFragmentDoc,
  '\n  mutation projectUnarchive($projectId: ID!) {\n    projectUnarchive(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n':
    types.ProjectUnarchiveDocument,
  '\n  fragment ProjectForm on Project {\n    title\n    startDate\n    endDate\n    canModify\n    hasWorkHours\n    ...DeleteOrArchiveProjectButton\n  }\n':
    types.ProjectFormFragmentDoc,
  '\n  fragment ProjectMemberListProject on Project {\n    id\n    canModify\n    ...RemoveUserFromProjectButtonProject\n    ...AddProjectMemberForm\n    members {\n      id\n      image\n      name\n      role(projectId: $projectId)\n      ...RemoveUserFromProjectButtonUser\n    }\n  }\n':
    types.ProjectMemberListProjectFragmentDoc,
  '\n  mutation projectMembershipUpdate($projectId: ID!, $userId: ID!, $role: Role!) {\n    projectMembershipCreate(projectId: $projectId, userId: $userId, role: $role) {\n      id\n    }\n  }\n':
    types.ProjectMembershipUpdateDocument,
  '\n  fragment RemoveUserFromProjectButtonUser on User {\n    id\n    name\n  }\n':
    types.RemoveUserFromProjectButtonUserFragmentDoc,
  '\n  fragment RemoveUserFromProjectButtonProject on Project {\n    id\n    title\n  }\n':
    types.RemoveUserFromProjectButtonProjectFragmentDoc,
  '\n  mutation projectMembershipDelete($projectId: ID!, $userId: ID!) {\n    projectMembershipDelete(projectId: $projectId, userId: $userId) {\n      id\n    }\n  }\n':
    types.ProjectMembershipDeleteDocument,
  '\n  fragment ProjectTableItem on Project {\n    id\n    title\n    startDate\n    endDate\n  }\n':
    types.ProjectTableItemFragmentDoc,
  '\n  mutation projectLock($date: MonthInput!, $projectId: ID!) {\n    projectLock(date: $date, projectId: $projectId) {\n      isLocked(date: $date)\n    }\n  }\n':
    types.ProjectLockDocument,
  '\n  mutation projectUnlock($date: MonthInput!, $projectId: ID!) {\n    projectUnlock(date: $date, projectId: $projectId) {\n      isLocked(date: $date)\n    }\n  }\n':
    types.ProjectUnlockDocument,
  '\n  fragment ReportProject on Project {\n    id\n    title\n    role\n    canModify\n    isLocked(date: $date)\n  }\n':
    types.ReportProjectFragmentDoc,
  '\n  query reportProjects($from: Date!, $to: Date, $filter: ProjectFilter, $date: MonthInput!) {\n    projects(from: $from, to: $to, filter: $filter) {\n      ...ReportProject\n    }\n  }\n':
    types.ReportProjectsDocument,
  '\n  query report($projectId: ID!, $month: Int!, $year: Int!, $userId: ID, $groupByUser: Boolean!) {\n    project(projectId: $projectId) {\n      canModify\n    }\n    report(projectId: $projectId, month: $month, year: $year, userId: $userId) {\n      groupedByDate {\n        date\n        duration\n        workHours {\n          id\n          duration\n          user {\n            name\n          }\n          task {\n            title\n          }\n        }\n      }\n      groupedByTask {\n        task {\n          id\n          title\n        }\n        duration\n      }\n      groupedByUser @include(if: $groupByUser) {\n        user {\n          id\n          name\n        }\n        duration\n      }\n    }\n  }\n':
    types.ReportDocument,
  '\n  fragment ReportUser on User {\n    id\n    name\n    durationWorkedOnProject(from: $from, to: $to, projectId: $projectId)\n  }\n':
    types.ReportUserFragmentDoc,
  '\n  query reportUsers($projectId: ID!, $from: Date!, $to: Date!) {\n    project(projectId: $projectId) {\n      id\n      members(includePastMembers: true) {\n        ...ReportUser\n      }\n    }\n  }\n':
    types.ReportUsersDocument,
  '\n  fragment TaskListProject on Project {\n    id\n    canModify\n    tasks {\n      id\n      ...TaskRow\n    }\n  }\n':
    types.TaskListProjectFragmentDoc,
  '\n  mutation taskCreate($data: TaskInput!) {\n    taskCreate(data: $data) {\n      id\n    }\n  }\n':
    types.TaskCreateDocument,
  '\n  fragment TaskRow on Task {\n    id\n    title\n    canModify\n    isLockedByAdmin\n    ...DeleteTaskModal\n  }\n':
    types.TaskRowFragmentDoc,
  '\n  mutation taskUpdate($id: ID!, $data: TaskUpdateInput!) {\n    taskUpdate(id: $id, data: $data) {\n      id\n    }\n  }\n':
    types.TaskUpdateDocument,
  '\n  fragment SheetDayRow on WorkHour {\n    id\n    duration\n    project {\n      title\n    }\n    task {\n      title\n    }\n    user {\n      name\n    }\n  }\n':
    types.SheetDayRowFragmentDoc,
  '\n  query workHours($from: Date!, $to: Date) {\n    workHours(from: $from, to: $to) {\n      date\n      ...SheetDayRow\n    }\n  }\n':
    types.WorkHoursDocument,
  '\n  query currentTracking {\n    currentTracking {\n      ...TrackingButtonsTracking\n      start\n      task {\n        title\n        project {\n          title\n        }\n      }\n    }\n  }\n':
    types.CurrentTrackingDocument,
  '\n  fragment TrackingButtonsTracking on Tracking {\n    start\n    task {\n      id\n      title\n      project {\n        title\n      }\n    }\n  }\n':
    types.TrackingButtonsTrackingFragmentDoc,
  '\n  fragment TrackingButtonsTask on Task {\n    id\n    isLocked\n  }\n': types.TrackingButtonsTaskFragmentDoc,
  '\n  mutation trackingStart($taskId: ID!) {\n    trackingStart(taskId: $taskId) {\n      start\n      task {\n        id\n      }\n    }\n  }\n':
    types.TrackingStartDocument,
  '\n  mutation trackingStop {\n    trackingStop {\n      id\n      task {\n        id\n      }\n    }\n  }\n':
    types.TrackingStopDocument,
  '\n  mutation trackingCancel {\n    trackingCancel {\n      start\n      task {\n        id\n      }\n    }\n  }\n':
    types.TrackingCancelDocument,
  '\n  fragment TaskLockButton on Task {\n    id\n    isLockedByUser\n  }\n': types.TaskLockButtonFragmentDoc,
  '\n  mutation lockTask($taskId: ID!) {\n    taskLock(taskId: $taskId) {\n      id\n      isLockedByUser\n    }\n  }\n':
    types.LockTaskDocument,
  '\n  mutation unlockTask($taskId: ID!) {\n    taskUnlock(taskId: $taskId) {\n      id\n      isLockedByUser\n    }\n  }\n':
    types.UnlockTaskDocument,
  '\n  fragment WeekGridProject on Project {\n    id\n    tasks {\n      workHours(from: $from, to: $to) {\n        duration\n        ...WeekGridFooter\n      }\n    }\n    ...WeekGridProjectRowGroup\n  }\n':
    types.WeekGridProjectFragmentDoc,
  '\n  fragment WeekGridFooter on WorkHour {\n    duration\n    date\n  }\n': types.WeekGridFooterFragmentDoc,
  '\n  fragment WeekGridProjectRowGroup on Project {\n    id\n    title\n    isArchived\n    tasks {\n      id\n      ...WeekGridTaskRow\n      workHours(from: $from, to: $to) {\n        duration\n      }\n    }\n  }\n':
    types.WeekGridProjectRowGroupFragmentDoc,
  '\n  mutation workHourUpdate($data: WorkHourInput!, $date: Date!, $taskId: ID!) {\n    workHourUpdate(data: $data, date: $date, taskId: $taskId) {\n      id\n    }\n  }\n':
    types.WorkHourUpdateDocument,
  '\n  query isLocked($year: Int!, $month: Int!, $projectId: ID!, $userId: ID!, $taskId: ID!) {\n    report(year: $year, month: $month, projectId: $projectId, userId: $userId) {\n      isLocked\n    }\n    task(taskId: $taskId) {\n      isLockedByUser\n      isLockedByAdmin\n    }\n  }\n':
    types.IsLockedDocument,
  '\n  fragment WeekGridTaskRow on Task {\n    id\n    title\n    project {\n      startDate\n      endDate\n    }\n    workHours(from: $from, to: $to) {\n      duration\n      date\n    }\n    project {\n      id\n      isProjectMember\n      isArchived\n    }\n    tracking {\n      ...TrackingButtonsTracking\n    }\n    isLockedByAdmin\n    ...TrackingButtonsTask\n    ...TaskLockButton\n  }\n':
    types.WeekGridTaskRowFragmentDoc,
  '\n  query project($projectId: ID!) {\n    project(projectId: $projectId) {\n      id\n      ...TaskListProject\n      ...ProjectForm\n      ...ProjectMemberListProject\n      ...InviteLinkProjectFragment\n    }\n  }\n':
    types.ProjectDocument,
  '\n  mutation projectUpdate($id: ID!, $data: ProjectInput!) {\n    projectUpdate(id: $id, data: $data) {\n      id\n    }\n  }\n':
    types.ProjectUpdateDocument,
  '\n  query myProjects($from: Date!, $filter: ProjectFilter) {\n    projects(from: $from, filter: $filter) {\n      ...ProjectTableItem\n    }\n  }\n':
    types.MyProjectsDocument,
  '\n  query projectCounts($from: Date!, $to: Date) {\n    allCounts: projectsCount(from: $from, to: $to, filter: ALL)\n    activeCounts: projectsCount(from: $from, to: $to, filter: ACTIVE)\n    futureCounts: projectsCount(from: $from, to: $to, filter: FUTURE)\n    pastCounts: projectsCount(from: $from, to: $to, filter: PAST)\n    archivedCounts: projectsCount(from: $from, to: $to, filter: ARCHIVED)\n  }\n':
    types.ProjectCountsDocument,
  '\n  mutation projectMembershipJoin($inviteKey: String!) {\n    projectMembershipJoin(inviteKey: $inviteKey) {\n      id\n    }\n  }\n':
    types.ProjectMembershipJoinDocument,
  '\n  mutation projectCreate($data: ProjectInput!) {\n    projectCreate(data: $data) {\n      id\n    }\n  }\n':
    types.ProjectCreateDocument,
  '\n  query weekGrid($from: Date!, $to: Date) {\n    projects(from: $from, to: $to, includeProjectsWhereUserBookedWorkHours: true) {\n      ...WeekGridProject\n    }\n  }\n':
    types.WeekGridDocument,
}

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment AddProjectMemberForm on Project {\n    id\n    inviteKey\n    title\n  }\n',
): typeof documents['\n  fragment AddProjectMemberForm on Project {\n    id\n    inviteKey\n    title\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectMembershipInviteByEmail($email: String!, $projectId: ID!) {\n    projectMembershipInviteByEmail(email: $email, projectId: $projectId) {\n      ... on MutationProjectMembershipInviteByEmailSuccess {\n        data {\n          title\n          members {\n            name\n          }\n        }\n      }\n      ... on UserNotFoundError {\n        email\n      }\n      __typename\n    }\n  }\n',
): typeof documents['\n  mutation projectMembershipInviteByEmail($email: String!, $projectId: ID!) {\n    projectMembershipInviteByEmail(email: $email, projectId: $projectId) {\n      ... on MutationProjectMembershipInviteByEmailSuccess {\n        data {\n          title\n          members {\n            name\n          }\n        }\n      }\n      ... on UserNotFoundError {\n        email\n      }\n      __typename\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment DeleteTaskModal on Task {\n    id\n    hasWorkHours\n    title\n  }\n',
): typeof documents['\n  fragment DeleteTaskModal on Task {\n    id\n    hasWorkHours\n    title\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation taskDelete($id: ID!, $hasWorkHours: Boolean!) {\n    taskDelete(id: $id) @skip(if: $hasWorkHours) {\n      id\n    }\n    taskArchive(taskId: $id) @include(if: $hasWorkHours) {\n      id\n    }\n  }\n',
): typeof documents['\n  mutation taskDelete($id: ID!, $hasWorkHours: Boolean!) {\n    taskDelete(id: $id) @skip(if: $hasWorkHours) {\n      id\n    }\n    taskArchive(taskId: $id) @include(if: $hasWorkHours) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment InviteLinkProjectFragment on Project {\n    id\n    inviteKey\n  }\n',
): typeof documents['\n  fragment InviteLinkProjectFragment on Project {\n    id\n    inviteKey\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectRegenerateInviteKey($projectId: ID!) {\n    projectRegenerateInviteKey(projectId: $projectId) {\n      title\n      inviteKey\n    }\n  }\n',
): typeof documents['\n  mutation projectRegenerateInviteKey($projectId: ID!) {\n    projectRegenerateInviteKey(projectId: $projectId) {\n      title\n      inviteKey\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ArchiveProjectModal on Project {\n    id\n    title\n  }\n',
): typeof documents['\n  fragment ArchiveProjectModal on Project {\n    id\n    title\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectArchive($projectId: ID!) {\n    projectArchive(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n',
): typeof documents['\n  mutation projectArchive($projectId: ID!) {\n    projectArchive(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment DeleteOrArchiveProjectButton on Project {\n    id\n    hasWorkHours\n    isArchived\n    ...DeleteProjectModal\n    ...UnarchiveProjectModal\n    ...ArchiveProjectModal\n  }\n',
): typeof documents['\n  fragment DeleteOrArchiveProjectButton on Project {\n    id\n    hasWorkHours\n    isArchived\n    ...DeleteProjectModal\n    ...UnarchiveProjectModal\n    ...ArchiveProjectModal\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment DeleteProjectModal on Project {\n    id\n    title\n  }\n',
): typeof documents['\n  fragment DeleteProjectModal on Project {\n    id\n    title\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectDelete($id: ID!) {\n    projectDelete(id: $id) {\n      id\n    }\n  }\n',
): typeof documents['\n  mutation projectDelete($id: ID!) {\n    projectDelete(id: $id) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment UnarchiveProjectModal on Project {\n    id\n    title\n  }\n',
): typeof documents['\n  fragment UnarchiveProjectModal on Project {\n    id\n    title\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectUnarchive($projectId: ID!) {\n    projectUnarchive(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n',
): typeof documents['\n  mutation projectUnarchive($projectId: ID!) {\n    projectUnarchive(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ProjectForm on Project {\n    title\n    startDate\n    endDate\n    canModify\n    hasWorkHours\n    ...DeleteOrArchiveProjectButton\n  }\n',
): typeof documents['\n  fragment ProjectForm on Project {\n    title\n    startDate\n    endDate\n    canModify\n    hasWorkHours\n    ...DeleteOrArchiveProjectButton\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ProjectMemberListProject on Project {\n    id\n    canModify\n    ...RemoveUserFromProjectButtonProject\n    ...AddProjectMemberForm\n    members {\n      id\n      image\n      name\n      role(projectId: $projectId)\n      ...RemoveUserFromProjectButtonUser\n    }\n  }\n',
): typeof documents['\n  fragment ProjectMemberListProject on Project {\n    id\n    canModify\n    ...RemoveUserFromProjectButtonProject\n    ...AddProjectMemberForm\n    members {\n      id\n      image\n      name\n      role(projectId: $projectId)\n      ...RemoveUserFromProjectButtonUser\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectMembershipUpdate($projectId: ID!, $userId: ID!, $role: Role!) {\n    projectMembershipCreate(projectId: $projectId, userId: $userId, role: $role) {\n      id\n    }\n  }\n',
): typeof documents['\n  mutation projectMembershipUpdate($projectId: ID!, $userId: ID!, $role: Role!) {\n    projectMembershipCreate(projectId: $projectId, userId: $userId, role: $role) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment RemoveUserFromProjectButtonUser on User {\n    id\n    name\n  }\n',
): typeof documents['\n  fragment RemoveUserFromProjectButtonUser on User {\n    id\n    name\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment RemoveUserFromProjectButtonProject on Project {\n    id\n    title\n  }\n',
): typeof documents['\n  fragment RemoveUserFromProjectButtonProject on Project {\n    id\n    title\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectMembershipDelete($projectId: ID!, $userId: ID!) {\n    projectMembershipDelete(projectId: $projectId, userId: $userId) {\n      id\n    }\n  }\n',
): typeof documents['\n  mutation projectMembershipDelete($projectId: ID!, $userId: ID!) {\n    projectMembershipDelete(projectId: $projectId, userId: $userId) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ProjectTableItem on Project {\n    id\n    title\n    startDate\n    endDate\n  }\n',
): typeof documents['\n  fragment ProjectTableItem on Project {\n    id\n    title\n    startDate\n    endDate\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectLock($date: MonthInput!, $projectId: ID!) {\n    projectLock(date: $date, projectId: $projectId) {\n      isLocked(date: $date)\n    }\n  }\n',
): typeof documents['\n  mutation projectLock($date: MonthInput!, $projectId: ID!) {\n    projectLock(date: $date, projectId: $projectId) {\n      isLocked(date: $date)\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectUnlock($date: MonthInput!, $projectId: ID!) {\n    projectUnlock(date: $date, projectId: $projectId) {\n      isLocked(date: $date)\n    }\n  }\n',
): typeof documents['\n  mutation projectUnlock($date: MonthInput!, $projectId: ID!) {\n    projectUnlock(date: $date, projectId: $projectId) {\n      isLocked(date: $date)\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ReportProject on Project {\n    id\n    title\n    role\n    canModify\n    isLocked(date: $date)\n  }\n',
): typeof documents['\n  fragment ReportProject on Project {\n    id\n    title\n    role\n    canModify\n    isLocked(date: $date)\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query reportProjects($from: Date!, $to: Date, $filter: ProjectFilter, $date: MonthInput!) {\n    projects(from: $from, to: $to, filter: $filter) {\n      ...ReportProject\n    }\n  }\n',
): typeof documents['\n  query reportProjects($from: Date!, $to: Date, $filter: ProjectFilter, $date: MonthInput!) {\n    projects(from: $from, to: $to, filter: $filter) {\n      ...ReportProject\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query report($projectId: ID!, $month: Int!, $year: Int!, $userId: ID, $groupByUser: Boolean!) {\n    project(projectId: $projectId) {\n      canModify\n    }\n    report(projectId: $projectId, month: $month, year: $year, userId: $userId) {\n      groupedByDate {\n        date\n        duration\n        workHours {\n          id\n          duration\n          user {\n            name\n          }\n          task {\n            title\n          }\n        }\n      }\n      groupedByTask {\n        task {\n          id\n          title\n        }\n        duration\n      }\n      groupedByUser @include(if: $groupByUser) {\n        user {\n          id\n          name\n        }\n        duration\n      }\n    }\n  }\n',
): typeof documents['\n  query report($projectId: ID!, $month: Int!, $year: Int!, $userId: ID, $groupByUser: Boolean!) {\n    project(projectId: $projectId) {\n      canModify\n    }\n    report(projectId: $projectId, month: $month, year: $year, userId: $userId) {\n      groupedByDate {\n        date\n        duration\n        workHours {\n          id\n          duration\n          user {\n            name\n          }\n          task {\n            title\n          }\n        }\n      }\n      groupedByTask {\n        task {\n          id\n          title\n        }\n        duration\n      }\n      groupedByUser @include(if: $groupByUser) {\n        user {\n          id\n          name\n        }\n        duration\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ReportUser on User {\n    id\n    name\n    durationWorkedOnProject(from: $from, to: $to, projectId: $projectId)\n  }\n',
): typeof documents['\n  fragment ReportUser on User {\n    id\n    name\n    durationWorkedOnProject(from: $from, to: $to, projectId: $projectId)\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query reportUsers($projectId: ID!, $from: Date!, $to: Date!) {\n    project(projectId: $projectId) {\n      id\n      members(includePastMembers: true) {\n        ...ReportUser\n      }\n    }\n  }\n',
): typeof documents['\n  query reportUsers($projectId: ID!, $from: Date!, $to: Date!) {\n    project(projectId: $projectId) {\n      id\n      members(includePastMembers: true) {\n        ...ReportUser\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment TaskListProject on Project {\n    id\n    canModify\n    tasks {\n      id\n      ...TaskRow\n    }\n  }\n',
): typeof documents['\n  fragment TaskListProject on Project {\n    id\n    canModify\n    tasks {\n      id\n      ...TaskRow\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation taskCreate($data: TaskInput!) {\n    taskCreate(data: $data) {\n      id\n    }\n  }\n',
): typeof documents['\n  mutation taskCreate($data: TaskInput!) {\n    taskCreate(data: $data) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment TaskRow on Task {\n    id\n    title\n    canModify\n    isLockedByAdmin\n    ...DeleteTaskModal\n  }\n',
): typeof documents['\n  fragment TaskRow on Task {\n    id\n    title\n    canModify\n    isLockedByAdmin\n    ...DeleteTaskModal\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation taskUpdate($id: ID!, $data: TaskUpdateInput!) {\n    taskUpdate(id: $id, data: $data) {\n      id\n    }\n  }\n',
): typeof documents['\n  mutation taskUpdate($id: ID!, $data: TaskUpdateInput!) {\n    taskUpdate(id: $id, data: $data) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment SheetDayRow on WorkHour {\n    id\n    duration\n    project {\n      title\n    }\n    task {\n      title\n    }\n    user {\n      name\n    }\n  }\n',
): typeof documents['\n  fragment SheetDayRow on WorkHour {\n    id\n    duration\n    project {\n      title\n    }\n    task {\n      title\n    }\n    user {\n      name\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query workHours($from: Date!, $to: Date) {\n    workHours(from: $from, to: $to) {\n      date\n      ...SheetDayRow\n    }\n  }\n',
): typeof documents['\n  query workHours($from: Date!, $to: Date) {\n    workHours(from: $from, to: $to) {\n      date\n      ...SheetDayRow\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query currentTracking {\n    currentTracking {\n      ...TrackingButtonsTracking\n      start\n      task {\n        title\n        project {\n          title\n        }\n      }\n    }\n  }\n',
): typeof documents['\n  query currentTracking {\n    currentTracking {\n      ...TrackingButtonsTracking\n      start\n      task {\n        title\n        project {\n          title\n        }\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment TrackingButtonsTracking on Tracking {\n    start\n    task {\n      id\n      title\n      project {\n        title\n      }\n    }\n  }\n',
): typeof documents['\n  fragment TrackingButtonsTracking on Tracking {\n    start\n    task {\n      id\n      title\n      project {\n        title\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment TrackingButtonsTask on Task {\n    id\n    isLocked\n  }\n',
): typeof documents['\n  fragment TrackingButtonsTask on Task {\n    id\n    isLocked\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation trackingStart($taskId: ID!) {\n    trackingStart(taskId: $taskId) {\n      start\n      task {\n        id\n      }\n    }\n  }\n',
): typeof documents['\n  mutation trackingStart($taskId: ID!) {\n    trackingStart(taskId: $taskId) {\n      start\n      task {\n        id\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation trackingStop {\n    trackingStop {\n      id\n      task {\n        id\n      }\n    }\n  }\n',
): typeof documents['\n  mutation trackingStop {\n    trackingStop {\n      id\n      task {\n        id\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation trackingCancel {\n    trackingCancel {\n      start\n      task {\n        id\n      }\n    }\n  }\n',
): typeof documents['\n  mutation trackingCancel {\n    trackingCancel {\n      start\n      task {\n        id\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment TaskLockButton on Task {\n    id\n    isLockedByUser\n  }\n',
): typeof documents['\n  fragment TaskLockButton on Task {\n    id\n    isLockedByUser\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation lockTask($taskId: ID!) {\n    taskLock(taskId: $taskId) {\n      id\n      isLockedByUser\n    }\n  }\n',
): typeof documents['\n  mutation lockTask($taskId: ID!) {\n    taskLock(taskId: $taskId) {\n      id\n      isLockedByUser\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation unlockTask($taskId: ID!) {\n    taskUnlock(taskId: $taskId) {\n      id\n      isLockedByUser\n    }\n  }\n',
): typeof documents['\n  mutation unlockTask($taskId: ID!) {\n    taskUnlock(taskId: $taskId) {\n      id\n      isLockedByUser\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment WeekGridProject on Project {\n    id\n    tasks {\n      workHours(from: $from, to: $to) {\n        duration\n        ...WeekGridFooter\n      }\n    }\n    ...WeekGridProjectRowGroup\n  }\n',
): typeof documents['\n  fragment WeekGridProject on Project {\n    id\n    tasks {\n      workHours(from: $from, to: $to) {\n        duration\n        ...WeekGridFooter\n      }\n    }\n    ...WeekGridProjectRowGroup\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment WeekGridFooter on WorkHour {\n    duration\n    date\n  }\n',
): typeof documents['\n  fragment WeekGridFooter on WorkHour {\n    duration\n    date\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment WeekGridProjectRowGroup on Project {\n    id\n    title\n    isArchived\n    tasks {\n      id\n      ...WeekGridTaskRow\n      workHours(from: $from, to: $to) {\n        duration\n      }\n    }\n  }\n',
): typeof documents['\n  fragment WeekGridProjectRowGroup on Project {\n    id\n    title\n    isArchived\n    tasks {\n      id\n      ...WeekGridTaskRow\n      workHours(from: $from, to: $to) {\n        duration\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation workHourUpdate($data: WorkHourInput!, $date: Date!, $taskId: ID!) {\n    workHourUpdate(data: $data, date: $date, taskId: $taskId) {\n      id\n    }\n  }\n',
): typeof documents['\n  mutation workHourUpdate($data: WorkHourInput!, $date: Date!, $taskId: ID!) {\n    workHourUpdate(data: $data, date: $date, taskId: $taskId) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query isLocked($year: Int!, $month: Int!, $projectId: ID!, $userId: ID!, $taskId: ID!) {\n    report(year: $year, month: $month, projectId: $projectId, userId: $userId) {\n      isLocked\n    }\n    task(taskId: $taskId) {\n      isLockedByUser\n      isLockedByAdmin\n    }\n  }\n',
): typeof documents['\n  query isLocked($year: Int!, $month: Int!, $projectId: ID!, $userId: ID!, $taskId: ID!) {\n    report(year: $year, month: $month, projectId: $projectId, userId: $userId) {\n      isLocked\n    }\n    task(taskId: $taskId) {\n      isLockedByUser\n      isLockedByAdmin\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment WeekGridTaskRow on Task {\n    id\n    title\n    project {\n      startDate\n      endDate\n    }\n    workHours(from: $from, to: $to) {\n      duration\n      date\n    }\n    project {\n      id\n      isProjectMember\n      isArchived\n    }\n    tracking {\n      ...TrackingButtonsTracking\n    }\n    isLockedByAdmin\n    ...TrackingButtonsTask\n    ...TaskLockButton\n  }\n',
): typeof documents['\n  fragment WeekGridTaskRow on Task {\n    id\n    title\n    project {\n      startDate\n      endDate\n    }\n    workHours(from: $from, to: $to) {\n      duration\n      date\n    }\n    project {\n      id\n      isProjectMember\n      isArchived\n    }\n    tracking {\n      ...TrackingButtonsTracking\n    }\n    isLockedByAdmin\n    ...TrackingButtonsTask\n    ...TaskLockButton\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query project($projectId: ID!) {\n    project(projectId: $projectId) {\n      id\n      ...TaskListProject\n      ...ProjectForm\n      ...ProjectMemberListProject\n      ...InviteLinkProjectFragment\n    }\n  }\n',
): typeof documents['\n  query project($projectId: ID!) {\n    project(projectId: $projectId) {\n      id\n      ...TaskListProject\n      ...ProjectForm\n      ...ProjectMemberListProject\n      ...InviteLinkProjectFragment\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectUpdate($id: ID!, $data: ProjectInput!) {\n    projectUpdate(id: $id, data: $data) {\n      id\n    }\n  }\n',
): typeof documents['\n  mutation projectUpdate($id: ID!, $data: ProjectInput!) {\n    projectUpdate(id: $id, data: $data) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query myProjects($from: Date!, $filter: ProjectFilter) {\n    projects(from: $from, filter: $filter) {\n      ...ProjectTableItem\n    }\n  }\n',
): typeof documents['\n  query myProjects($from: Date!, $filter: ProjectFilter) {\n    projects(from: $from, filter: $filter) {\n      ...ProjectTableItem\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query projectCounts($from: Date!, $to: Date) {\n    allCounts: projectsCount(from: $from, to: $to, filter: ALL)\n    activeCounts: projectsCount(from: $from, to: $to, filter: ACTIVE)\n    futureCounts: projectsCount(from: $from, to: $to, filter: FUTURE)\n    pastCounts: projectsCount(from: $from, to: $to, filter: PAST)\n    archivedCounts: projectsCount(from: $from, to: $to, filter: ARCHIVED)\n  }\n',
): typeof documents['\n  query projectCounts($from: Date!, $to: Date) {\n    allCounts: projectsCount(from: $from, to: $to, filter: ALL)\n    activeCounts: projectsCount(from: $from, to: $to, filter: ACTIVE)\n    futureCounts: projectsCount(from: $from, to: $to, filter: FUTURE)\n    pastCounts: projectsCount(from: $from, to: $to, filter: PAST)\n    archivedCounts: projectsCount(from: $from, to: $to, filter: ARCHIVED)\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectMembershipJoin($inviteKey: String!) {\n    projectMembershipJoin(inviteKey: $inviteKey) {\n      id\n    }\n  }\n',
): typeof documents['\n  mutation projectMembershipJoin($inviteKey: String!) {\n    projectMembershipJoin(inviteKey: $inviteKey) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectCreate($data: ProjectInput!) {\n    projectCreate(data: $data) {\n      id\n    }\n  }\n',
): typeof documents['\n  mutation projectCreate($data: ProjectInput!) {\n    projectCreate(data: $data) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query weekGrid($from: Date!, $to: Date) {\n    projects(from: $from, to: $to, includeProjectsWhereUserBookedWorkHours: true) {\n      ...WeekGridProject\n    }\n  }\n',
): typeof documents['\n  query weekGrid($from: Date!, $to: Date) {\n    projects(from: $from, to: $to, includeProjectsWhereUserBookedWorkHours: true) {\n      ...WeekGridProject\n    }\n  }\n']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never
