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
  '\n  mutation projectMembershipInviteByEmail($email: String!, $projectId: ID!) {\n    projectMembershipInviteByEmail(email: $email, projectId: $projectId) {\n      title\n      members {\n        name\n      }\n    }\n  }\n':
    types.ProjectMembershipInviteByEmailDocument,
  '\n  fragment DeleteProjectModal on Project {\n    id\n    title\n  }\n': types.DeleteProjectModalFragmentDoc,
  '\n  mutation projectDelete($id: ID!) {\n    projectDelete(id: $id) {\n      id\n    }\n  }\n':
    types.ProjectDeleteDocument,
  '\n  fragment DeleteTaskModal on Task {\n    id\n    hasWorkHours\n    title\n  }\n':
    types.DeleteTaskModalFragmentDoc,
  '\n  mutation taskDelete($id: ID!, $hasWorkHours: Boolean!) {\n    taskDelete(id: $id) @skip(if: $hasWorkHours) {\n      id\n    }\n    taskArchive(taskId: $id) @include(if: $hasWorkHours) {\n      id\n    }\n  }\n':
    types.TaskDeleteDocument,
  '\n  fragment ProjectForm on Project {\n    title\n    startDate\n    endDate\n    canModify\n    ...DeleteProjectModal\n  }\n':
    types.ProjectFormFragmentDoc,
  '\n  fragment ProjectMemberListUser on User {\n    id\n    image\n    name\n    role(projectId: $projectId)\n  }\n':
    types.ProjectMemberListUserFragmentDoc,
  '\n  fragment ProjectTableItem on Project {\n    id\n    title\n    startDate\n    endDate\n  }\n':
    types.ProjectTableItemFragmentDoc,
  '\n  mutation projectLock($date: MonthInput!, $projectId: ID!) {\n    projectLock(date: $date, projectId: $projectId) {\n      isLocked(date: $date)\n    }\n  }\n':
    types.ProjectLockDocument,
  '\n  mutation projectUnlock($date: MonthInput!, $projectId: ID!) {\n    projectUnlock(date: $date, projectId: $projectId) {\n      isLocked(date: $date)\n    }\n  }\n':
    types.ProjectUnlockDocument,
  '\n  fragment ReportProject on Project {\n    id\n    title\n    isLocked(date: $date)\n  }\n':
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
  '\n  fragment TaskRow on Task {\n    id\n    title\n    hourlyRate\n    canModify\n    isLockedByAdmin\n    ...DeleteTaskModal\n  }\n':
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
  '\n  fragment WeekTableProject on Project {\n    id\n    tasks {\n      workHours(from: $from, to: $to) {\n        duration\n        ...WeekTableFooter\n      }\n    }\n    ...WeekTableProjectRowGroup\n  }\n':
    types.WeekTableProjectFragmentDoc,
  '\n  fragment WeekTableFooter on WorkHour {\n    duration\n    date\n  }\n': types.WeekTableFooterFragmentDoc,
  '\n  fragment WeekTableProjectRowGroup on Project {\n    id\n    title\n    tasks {\n      id\n      ...WeekTableTaskRow\n    }\n  }\n':
    types.WeekTableProjectRowGroupFragmentDoc,
  '\n  mutation workHourUpdate($data: WorkHourInput!, $date: Date!, $taskId: ID!) {\n    workHourUpdate(data: $data, date: $date, taskId: $taskId) {\n      id\n    }\n  }\n':
    types.WorkHourUpdateDocument,
  '\n  query isLocked($year: Int!, $month: Int!, $projectId: ID!, $userId: ID!, $taskId: ID!) {\n    report(year: $year, month: $month, projectId: $projectId, userId: $userId) {\n      isLocked\n    }\n    task(taskId: $taskId) {\n      isLockedByUser\n      isLockedByAdmin\n    }\n  }\n':
    types.IsLockedDocument,
  '\n  fragment WeekTableTaskRow on Task {\n    id\n    title\n    project {\n      startDate\n      endDate\n    }\n    workHours(from: $from, to: $to) {\n      duration\n      date\n    }\n    project {\n      id\n      isProjectMember\n    }\n    tracking {\n      ...TrackingButtonsTracking\n    }\n    isLockedByAdmin\n    ...TrackingButtonsTask\n    ...TaskLockButton\n  }\n':
    types.WeekTableTaskRowFragmentDoc,
  '\n  query project($projectId: ID!) {\n    project(projectId: $projectId) {\n      id\n      ...TaskListProject\n      members {\n        ...ProjectMemberListUser\n      }\n      ...ProjectForm\n    }\n  }\n':
    types.ProjectDocument,
  '\n  mutation projectUpdate($id: ID!, $data: ProjectInput!) {\n    projectUpdate(id: $id, data: $data) {\n      id\n    }\n  }\n':
    types.ProjectUpdateDocument,
  '\n  query myProjects($from: Date!, $filter: ProjectFilter) {\n    projects(from: $from, filter: $filter) {\n      ...ProjectTableItem\n    }\n  }\n':
    types.MyProjectsDocument,
  '\n  query projectCounts($from: Date!, $to: Date) {\n    allCounts: projectsCount(from: $from, to: $to, filter: ALL)\n    activeCounts: projectsCount(from: $from, to: $to, filter: ACTIVE)\n    futureCounts: projectsCount(from: $from, to: $to, filter: FUTURE)\n    pastCounts: projectsCount(from: $from, to: $to, filter: PAST)\n  }\n':
    types.ProjectCountsDocument,
  '\n  mutation projectCreate($data: ProjectInput!) {\n    projectCreate(data: $data) {\n      id\n    }\n  }\n':
    types.ProjectCreateDocument,
  '\n  query weekTable($from: Date!, $to: Date) {\n    projects(from: $from, to: $to, includeProjectsWhereUserBookedWorkHours: true) {\n      ...WeekTableProject\n    }\n  }\n':
    types.WeekTableDocument,
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
  source: '\n  mutation projectMembershipInviteByEmail($email: String!, $projectId: ID!) {\n    projectMembershipInviteByEmail(email: $email, projectId: $projectId) {\n      title\n      members {\n        name\n      }\n    }\n  }\n',
): typeof documents['\n  mutation projectMembershipInviteByEmail($email: String!, $projectId: ID!) {\n    projectMembershipInviteByEmail(email: $email, projectId: $projectId) {\n      title\n      members {\n        name\n      }\n    }\n  }\n']
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
  source: '\n  fragment ProjectForm on Project {\n    title\n    startDate\n    endDate\n    canModify\n    ...DeleteProjectModal\n  }\n',
): typeof documents['\n  fragment ProjectForm on Project {\n    title\n    startDate\n    endDate\n    canModify\n    ...DeleteProjectModal\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ProjectMemberListUser on User {\n    id\n    image\n    name\n    role(projectId: $projectId)\n  }\n',
): typeof documents['\n  fragment ProjectMemberListUser on User {\n    id\n    image\n    name\n    role(projectId: $projectId)\n  }\n']
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
  source: '\n  fragment ReportProject on Project {\n    id\n    title\n    isLocked(date: $date)\n  }\n',
): typeof documents['\n  fragment ReportProject on Project {\n    id\n    title\n    isLocked(date: $date)\n  }\n']
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
  source: '\n  fragment TaskRow on Task {\n    id\n    title\n    hourlyRate\n    canModify\n    isLockedByAdmin\n    ...DeleteTaskModal\n  }\n',
): typeof documents['\n  fragment TaskRow on Task {\n    id\n    title\n    hourlyRate\n    canModify\n    isLockedByAdmin\n    ...DeleteTaskModal\n  }\n']
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
  source: '\n  fragment WeekTableProject on Project {\n    id\n    tasks {\n      workHours(from: $from, to: $to) {\n        duration\n        ...WeekTableFooter\n      }\n    }\n    ...WeekTableProjectRowGroup\n  }\n',
): typeof documents['\n  fragment WeekTableProject on Project {\n    id\n    tasks {\n      workHours(from: $from, to: $to) {\n        duration\n        ...WeekTableFooter\n      }\n    }\n    ...WeekTableProjectRowGroup\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment WeekTableFooter on WorkHour {\n    duration\n    date\n  }\n',
): typeof documents['\n  fragment WeekTableFooter on WorkHour {\n    duration\n    date\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment WeekTableProjectRowGroup on Project {\n    id\n    title\n    tasks {\n      id\n      ...WeekTableTaskRow\n    }\n  }\n',
): typeof documents['\n  fragment WeekTableProjectRowGroup on Project {\n    id\n    title\n    tasks {\n      id\n      ...WeekTableTaskRow\n    }\n  }\n']
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
  source: '\n  fragment WeekTableTaskRow on Task {\n    id\n    title\n    project {\n      startDate\n      endDate\n    }\n    workHours(from: $from, to: $to) {\n      duration\n      date\n    }\n    project {\n      id\n      isProjectMember\n    }\n    tracking {\n      ...TrackingButtonsTracking\n    }\n    isLockedByAdmin\n    ...TrackingButtonsTask\n    ...TaskLockButton\n  }\n',
): typeof documents['\n  fragment WeekTableTaskRow on Task {\n    id\n    title\n    project {\n      startDate\n      endDate\n    }\n    workHours(from: $from, to: $to) {\n      duration\n      date\n    }\n    project {\n      id\n      isProjectMember\n    }\n    tracking {\n      ...TrackingButtonsTracking\n    }\n    isLockedByAdmin\n    ...TrackingButtonsTask\n    ...TaskLockButton\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query project($projectId: ID!) {\n    project(projectId: $projectId) {\n      id\n      ...TaskListProject\n      members {\n        ...ProjectMemberListUser\n      }\n      ...ProjectForm\n    }\n  }\n',
): typeof documents['\n  query project($projectId: ID!) {\n    project(projectId: $projectId) {\n      id\n      ...TaskListProject\n      members {\n        ...ProjectMemberListUser\n      }\n      ...ProjectForm\n    }\n  }\n']
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
  source: '\n  query projectCounts($from: Date!, $to: Date) {\n    allCounts: projectsCount(from: $from, to: $to, filter: ALL)\n    activeCounts: projectsCount(from: $from, to: $to, filter: ACTIVE)\n    futureCounts: projectsCount(from: $from, to: $to, filter: FUTURE)\n    pastCounts: projectsCount(from: $from, to: $to, filter: PAST)\n  }\n',
): typeof documents['\n  query projectCounts($from: Date!, $to: Date) {\n    allCounts: projectsCount(from: $from, to: $to, filter: ALL)\n    activeCounts: projectsCount(from: $from, to: $to, filter: ACTIVE)\n    futureCounts: projectsCount(from: $from, to: $to, filter: FUTURE)\n    pastCounts: projectsCount(from: $from, to: $to, filter: PAST)\n  }\n']
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
  source: '\n  query weekTable($from: Date!, $to: Date) {\n    projects(from: $from, to: $to, includeProjectsWhereUserBookedWorkHours: true) {\n      ...WeekTableProject\n    }\n  }\n',
): typeof documents['\n  query weekTable($from: Date!, $to: Date) {\n    projects(from: $from, to: $to, includeProjectsWhereUserBookedWorkHours: true) {\n      ...WeekTableProject\n    }\n  }\n']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never
