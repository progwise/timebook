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
  '\n  fragment AccessTokenRow on AccessToken {\n    id\n    name\n    createdAt\n  }\n':
    types.AccessTokenRowFragmentDoc,
  '\n  mutation accessTokenDelete($id: ID!) {\n    accessTokenDelete(id: $id) {\n      id\n    }\n  }\n':
    types.AccessTokenDeleteDocument,
  '\n  fragment DeleteTaskButton on Task {\n    id\n    hasWorkHours\n    title\n  }\n':
    types.DeleteTaskButtonFragmentDoc,
  '\n  mutation taskDelete($id: ID!, $hasWorkHours: Boolean!) {\n    taskDelete(id: $id) @skip(if: $hasWorkHours) {\n      id\n    }\n    taskArchive(taskId: $id) @include(if: $hasWorkHours) {\n      id\n    }\n  }\n':
    types.TaskDeleteDocument,
  '\n  fragment LockTaskButton on Task {\n    id\n    isLockedByAdmin\n  }\n': types.LockTaskButtonFragmentDoc,
  '\n  mutation taskUpdate($id: ID!, $data: TaskUpdateInput!) {\n    taskUpdate(id: $id, data: $data) {\n      id\n    }\n  }\n':
    types.TaskUpdateDocument,
  '\n  fragment ArchiveOrUnarchiveOrganizationButton on Organization {\n    id\n    isArchived\n    ...UnarchiveOrganizationButton\n    ...ArchiveOrganizationButton\n  }\n':
    types.ArchiveOrUnarchiveOrganizationButtonFragmentDoc,
  '\n  fragment ArchiveOrganizationButton on Organization {\n    id\n    title\n  }\n':
    types.ArchiveOrganizationButtonFragmentDoc,
  '\n  mutation organizationArchive($organizationId: ID!) {\n    organizationArchive(organizationId: $organizationId) {\n      id\n      isArchived\n    }\n  }\n':
    types.OrganizationArchiveDocument,
  '\n  fragment UnarchiveOrganizationButton on Organization {\n    id\n    title\n  }\n':
    types.UnarchiveOrganizationButtonFragmentDoc,
  '\n  mutation organizationUnarchive($organizationId: ID!) {\n    organizationUnarchive(organizationId: $organizationId) {\n      id\n      isArchived\n    }\n  }\n':
    types.OrganizationUnarchiveDocument,
  '\n  fragment OrganizationForm on Organization {\n    title\n    address\n    canModify\n    subscriptionStatus\n    ...ArchiveOrUnarchiveOrganizationButton\n    ...SubscribeOrUnsubscribeOrganizationButton\n  }\n':
    types.OrganizationFormFragmentDoc,
  '\n  fragment SubscribeOrUnsubscribeOrganizationButton on Organization {\n    id\n    subscriptionStatus\n    ...UnsubscribeOrganizationButton\n  }\n':
    types.SubscribeOrUnsubscribeOrganizationButtonFragmentDoc,
  '\n  fragment UnsubscribeOrganizationButton on Organization {\n    id\n    title\n  }\n':
    types.UnsubscribeOrganizationButtonFragmentDoc,
  '\n  mutation organizationPaypalUnsubscribe($organizationId: ID!) {\n    organizationPaypalUnsubscribe(organizationId: $organizationId) {\n      id\n    }\n  }\n':
    types.OrganizationPaypalUnsubscribeDocument,
  '\n  fragment OrganizationMemberListOrganization on Organization {\n    id\n    canModify\n    ...RemoveUserFromOrganizationButtonOrganization\n    members {\n      id\n      image\n      name\n      organizationRole(organizationId: $organizationId)\n      ...RemoveUserFromOrganizationButtonUser\n    }\n  }\n':
    types.OrganizationMemberListOrganizationFragmentDoc,
  '\n  mutation organizationMembershipUpdate($organizationId: ID!, $userId: ID!, $organizationRole: Role!) {\n    organizationMembershipCreate(\n      organizationId: $organizationId\n      userId: $userId\n      organizationRole: $organizationRole\n    ) {\n      id\n    }\n  }\n':
    types.OrganizationMembershipUpdateDocument,
  '\n  fragment RemoveUserFromOrganizationButtonUser on User {\n    id\n    name\n  }\n':
    types.RemoveUserFromOrganizationButtonUserFragmentDoc,
  '\n  fragment RemoveUserFromOrganizationButtonOrganization on Organization {\n    id\n    title\n  }\n':
    types.RemoveUserFromOrganizationButtonOrganizationFragmentDoc,
  '\n  mutation OrganizationMembershipDelete($organizationId: ID!, $userId: ID!) {\n    organizationMembershipDelete(organizationId: $organizationId, userId: $userId) {\n      id\n    }\n  }\n':
    types.OrganizationMembershipDeleteDocument,
  '\n  fragment OrganizationTableItem on Organization {\n    id\n    title\n  }\n':
    types.OrganizationTableItemFragmentDoc,
  '\n  fragment ArchiveProjectButton on Project {\n    id\n    title\n  }\n': types.ArchiveProjectButtonFragmentDoc,
  '\n  mutation projectArchive($projectId: ID!) {\n    projectArchive(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n':
    types.ProjectArchiveDocument,
  '\n  fragment DeleteOrArchiveProjectButton on Project {\n    id\n    hasWorkHours\n    isArchived\n    ...DeleteProjectButton\n    ...UnarchiveProjectButton\n    ...ArchiveProjectButton\n  }\n':
    types.DeleteOrArchiveProjectButtonFragmentDoc,
  '\n  fragment DeleteProjectButton on Project {\n    id\n    title\n  }\n': types.DeleteProjectButtonFragmentDoc,
  '\n  mutation projectDelete($id: ID!) {\n    projectDelete(id: $id) {\n      id\n    }\n  }\n':
    types.ProjectDeleteDocument,
  '\n  fragment UnarchiveProjectButton on Project {\n    id\n    title\n  }\n': types.UnarchiveProjectButtonFragmentDoc,
  '\n  mutation projectUnarchive($projectId: ID!) {\n    projectUnarchive(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n':
    types.ProjectUnarchiveDocument,
  '\n  fragment ProjectForm on Project {\n    title\n    id\n    startDate\n    endDate\n    canModify\n    hasWorkHours\n    organization {\n      id\n      title\n      isArchived\n    }\n    ...DeleteOrArchiveProjectButton\n    ...ProjectInvitationButton\n  }\n':
    types.ProjectFormFragmentDoc,
  '\n  fragment Organization on Organization {\n    id\n    title\n    isArchived\n  }\n':
    types.OrganizationFragmentDoc,
  '\n  mutation projectMembershipInvitationCreate($projectId: ID!) {\n    projectMembershipInvitationCreate(projectId: $projectId) {\n      id\n      invitationKey\n      expireDate\n    }\n  }\n':
    types.ProjectMembershipInvitationCreateDocument,
  '\n  mutation projectMembershipCreate($projectId: ID!, $userId: ID!) {\n    projectMembershipCreate(projectId: $projectId, userId: $userId) {\n      id\n    }\n  }\n':
    types.ProjectMembershipCreateDocument,
  '\n  fragment ProjectInvitationButton on Project {\n    id\n    title\n    members {\n      id\n      projectRole(projectId: $projectId)\n    }\n    organization {\n      title\n      members {\n        id\n        name\n        image\n      }\n    }\n  }\n':
    types.ProjectInvitationButtonFragmentDoc,
  '\n  fragment ProjectMemberListProject on Project {\n    id\n    canModify\n    ...RemoveUserFromProjectButtonProject\n    members {\n      id\n      image\n      name\n      projectRole(projectId: $projectId)\n      ...RemoveUserFromProjectButtonUser\n    }\n  }\n':
    types.ProjectMemberListProjectFragmentDoc,
  '\n  mutation projectMembershipUpdate($projectId: ID!, $userId: ID!, $projectRole: Role!) {\n    projectMembershipCreate(projectId: $projectId, userId: $userId, projectRole: $projectRole) {\n      id\n    }\n  }\n':
    types.ProjectMembershipUpdateDocument,
  '\n  fragment RemoveUserFromProjectButtonUser on User {\n    id\n    name\n  }\n':
    types.RemoveUserFromProjectButtonUserFragmentDoc,
  '\n  fragment RemoveUserFromProjectButtonProject on Project {\n    id\n    title\n  }\n':
    types.RemoveUserFromProjectButtonProjectFragmentDoc,
  '\n  mutation projectMembershipDelete($projectId: ID!, $userId: ID!) {\n    projectMembershipDelete(projectId: $projectId, userId: $userId) {\n      id\n    }\n  }\n':
    types.ProjectMembershipDeleteDocument,
  '\n  fragment ProjectTableItem on Project {\n    id\n    title\n    startDate\n    endDate\n    members {\n      id\n      image\n      name\n    }\n  }\n':
    types.ProjectTableItemFragmentDoc,
  '\n  mutation projectLock($date: MonthInput!, $projectId: ID!) {\n    projectLock(date: $date, projectId: $projectId) {\n      isLocked(date: $date)\n    }\n  }\n':
    types.ProjectLockDocument,
  '\n  mutation projectUnlock($date: MonthInput!, $projectId: ID!) {\n    projectUnlock(date: $date, projectId: $projectId) {\n      isLocked(date: $date)\n    }\n  }\n':
    types.ProjectUnlockDocument,
  '\n  fragment ReportProject on Project {\n    id\n    title\n    canModify\n    isArchived\n    isLocked(date: $date)\n  }\n':
    types.ReportProjectFragmentDoc,
  '\n  query reportProjects($from: Date!, $to: Date, $filter: ProjectFilter, $date: MonthInput!) {\n    projects(from: $from, to: $to, filter: $filter) {\n      ...ReportProject\n    }\n  }\n':
    types.ReportProjectsDocument,
  '\n  query report($projectId: ID!, $month: Int!, $year: Int!, $userId: ID, $groupByUser: Boolean!) {\n    project(projectId: $projectId) {\n      canModify\n    }\n    report(projectId: $projectId, month: $month, year: $year, userId: $userId) {\n      groupedByDate {\n        date\n        duration\n        workHours {\n          id\n          duration\n          comment\n          user {\n            id\n            name\n          }\n          task {\n            id\n            title\n          }\n        }\n      }\n      groupedByTask {\n        task {\n          id\n          title\n        }\n        duration\n      }\n      groupedByUser @include(if: $groupByUser) {\n        user {\n          id\n          name\n        }\n        duration\n      }\n    }\n  }\n':
    types.ReportDocument,
  '\n  fragment ReportUser on User {\n    id\n    name\n    image\n    durationWorkedOnProject(from: $from, to: $to, projectId: $projectId)\n  }\n':
    types.ReportUserFragmentDoc,
  '\n  query reportUsers($projectId: ID!, $from: Date!, $to: Date!) {\n    project(projectId: $projectId) {\n      id\n      members(includePastMembers: true) {\n        ...ReportUser\n      }\n    }\n  }\n':
    types.ReportUsersDocument,
  '\n  fragment TaskListProject on Project {\n    id\n    canModify\n    tasks {\n      id\n      ...TaskRow\n    }\n  }\n':
    types.TaskListProjectFragmentDoc,
  '\n  mutation taskCreate($data: TaskInput!) {\n    taskCreate(data: $data) {\n      id\n    }\n  }\n':
    types.TaskCreateDocument,
  '\n  fragment TaskRow on Task {\n    id\n    title\n    canModify\n    isLockedByAdmin\n    ...DeleteTaskButton\n    ...LockTaskButton\n  }\n':
    types.TaskRowFragmentDoc,
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
  '\n  fragment ProjectMember on User {\n    id\n    name\n    image\n  }\n': types.ProjectMemberFragmentDoc,
  '\n  query MyProjectsMembers {\n    myProjectsMembers {\n      ...ProjectMember\n    }\n    user {\n      id\n    }\n  }\n':
    types.MyProjectsMembersDocument,
  '\n  fragment WeekGridProject on Project {\n    id\n    tasks {\n      workHourOfDays(from: $from, to: $to, projectMemberUserId: $projectMemberUserId) {\n        ...WeekGridFooter\n        workHour {\n          duration\n        }\n      }\n    }\n    ...WeekGridProjectRowGroup\n  }\n':
    types.WeekGridProjectFragmentDoc,
  '\n  fragment WeekGridFooter on WorkHourOfDay {\n    date\n    workHour {\n      duration\n    }\n  }\n':
    types.WeekGridFooterFragmentDoc,
  '\n  fragment WeekGridProjectRowGroup on Project {\n    id\n    title\n    isArchived\n    tasks {\n      id\n      ...WeekGridTaskRow\n      workHourOfDays(from: $from, to: $to, projectMemberUserId: $projectMemberUserId) {\n        workHour {\n          duration\n        }\n      }\n    }\n  }\n':
    types.WeekGridProjectRowGroupFragmentDoc,
  '\n  mutation workHourUpdate($data: WorkHourInput!, $date: Date!, $taskId: ID!, $projectMemberUserId: ID) {\n    workHourUpdate(data: $data, date: $date, taskId: $taskId, projectMemberUserId: $projectMemberUserId) {\n      id\n    }\n  }\n':
    types.WorkHourUpdateDocument,
  '\n  fragment WeekGridTaskRow on Task {\n    id\n    title\n    project {\n      startDate\n      endDate\n    }\n    workHourOfDays(from: $from, to: $to, projectMemberUserId: $projectMemberUserId) {\n      date\n      workHour {\n        duration\n      }\n      isLocked\n    }\n    project {\n      id\n      isProjectMember\n      isArchived\n    }\n    tracking {\n      ...TrackingButtonsTracking\n    }\n    isLockedByAdmin\n    ...TrackingButtonsTask\n    ...WorkHourCommentFragment\n  }\n':
    types.WeekGridTaskRowFragmentDoc,
  '\n  fragment WorkHourCommentFragment on Task {\n    id\n    title\n    workHourOfDays(from: $from, to: $to, projectMemberUserId: $projectMemberUserId) {\n      date\n      workHour {\n        comment\n      }\n      isLocked\n    }\n  }\n':
    types.WorkHourCommentFragmentFragmentDoc,
  '\n  mutation commentUpdate($comment: String!, $date: Date!, $taskId: ID!) {\n    workHourCommentUpdate(date: $date, taskId: $taskId, comment: $comment) {\n      comment\n    }\n  }\n':
    types.CommentUpdateDocument,
  '\n  query accessTokens {\n    accessTokens {\n      id\n      ...AccessTokenRow\n    }\n  }\n':
    types.AccessTokensDocument,
  '\n  mutation accessTokenCreate($name: String!) {\n    accessTokenCreate(name: $name)\n  }\n':
    types.AccessTokenCreateDocument,
  '\n  mutation organizationPaypalSubscriptionIdCreate($organizationId: ID!, $returnUrl: String!, $cancelUrl: String!) {\n    organizationPaypalSubscriptionIdCreate(\n      organizationId: $organizationId\n      returnUrl: $returnUrl\n      cancelUrl: $cancelUrl\n    )\n  }\n':
    types.OrganizationPaypalSubscriptionIdCreateDocument,
  '\n  query organizationDetails($organizationId: ID!) {\n    organization(organizationId: $organizationId) {\n      id\n      title\n    }\n  }\n':
    types.OrganizationDetailsDocument,
  '\n  fragment Invoice on Invoice {\n    id\n    invoiceDate\n    customerName\n    invoiceItems {\n      id\n      duration\n      hourlyRate\n    }\n  }\n':
    types.InvoiceFragmentDoc,
  '\n  query organization($organizationId: ID!) {\n    organization(organizationId: $organizationId) {\n      id\n      canModify\n      ...OrganizationForm\n      ...OrganizationMemberListOrganization\n      projects {\n        ...ProjectTableItem\n      }\n      invoices {\n        ...Invoice\n      }\n    }\n  }\n':
    types.OrganizationDocument,
  '\n  mutation organizationUpdate($id: ID!, $data: OrganizationInput!) {\n    organizationUpdate(id: $id, data: $data) {\n      id\n    }\n  }\n':
    types.OrganizationUpdateDocument,
  '\n  fragment InvoiceFragment on Invoice {\n    id\n    invoiceDate\n    customerName\n    customerAddress\n    payDate\n    sendDate\n    invoiceStatus\n  }\n':
    types.InvoiceFragmentFragmentDoc,
  '\n  fragment InvoiceItemsFragment on InvoiceItem {\n    id\n    duration\n    hourlyRate\n    task {\n      title\n    }\n  }\n':
    types.InvoiceItemsFragmentFragmentDoc,
  '\n  query invoice($invoiceId: ID!, $organizationId: ID!) {\n    invoice(invoiceId: $invoiceId, organizationId: $organizationId) {\n      ...InvoiceFragment\n      invoiceItems {\n        ...InvoiceItemsFragment\n      }\n    }\n  }\n':
    types.InvoiceDocument,
  '\n  query myOrganizations($filter: OrganizationFilter) {\n    organizations(filter: $filter) {\n      ...OrganizationTableItem\n    }\n  }\n':
    types.MyOrganizationsDocument,
  '\n  query organizationCounts {\n    allCounts: organizationsCount(filter: ALL)\n    activeCounts: organizationsCount(filter: ACTIVE)\n    archivedCounts: organizationsCount(filter: ARCHIVED)\n  }\n':
    types.OrganizationCountsDocument,
  '\n  mutation organizationCreate($data: OrganizationInput!) {\n    organizationCreate(data: $data) {\n      id\n    }\n  }\n':
    types.OrganizationCreateDocument,
  '\n  query project($projectId: ID!) {\n    project(projectId: $projectId) {\n      id\n      ...TaskListProject\n      ...ProjectForm\n      ...ProjectMemberListProject\n    }\n    organizations {\n      ...Organization\n    }\n  }\n':
    types.ProjectDocument,
  '\n  mutation projectUpdate($id: ID!, $data: ProjectInput!) {\n    projectUpdate(id: $id, data: $data) {\n      id\n    }\n  }\n':
    types.ProjectUpdateDocument,
  '\n  query myProjects($from: Date!, $filter: ProjectFilter) {\n    projects(from: $from, filter: $filter) {\n      ...ProjectTableItem\n    }\n  }\n':
    types.MyProjectsDocument,
  '\n  query projectCounts($from: Date!, $to: Date) {\n    allCounts: projectsCount(from: $from, to: $to, filter: ALL)\n    activeCounts: projectsCount(from: $from, to: $to, filter: ACTIVE)\n    futureCounts: projectsCount(from: $from, to: $to, filter: FUTURE)\n    pastCounts: projectsCount(from: $from, to: $to, filter: PAST)\n    archivedCounts: projectsCount(from: $from, to: $to, filter: ARCHIVED)\n  }\n':
    types.ProjectCountsDocument,
  '\n  mutation projectMembershipJoin($invitationKey: String!) {\n    projectMembershipJoin(invitationKey: $invitationKey) {\n      id\n    }\n  }\n':
    types.ProjectMembershipJoinDocument,
  '\n  mutation projectCreate($data: ProjectInput!) {\n    projectCreate(data: $data) {\n      id\n    }\n  }\n':
    types.ProjectCreateDocument,
  '\n  query organizations {\n    organizations {\n      ...Organization\n    }\n  }\n': types.OrganizationsDocument,
  '\n  query weekGrid($from: Date!, $to: Date, $projectMemberUserId: ID) {\n    projects(\n      from: $from\n      to: $to\n      projectMemberUserId: $projectMemberUserId\n      includeProjectsWhereUserBookedWorkHours: true\n    ) {\n      ...WeekGridProject\n    }\n  }\n':
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
  source: '\n  fragment AccessTokenRow on AccessToken {\n    id\n    name\n    createdAt\n  }\n',
): (typeof documents)['\n  fragment AccessTokenRow on AccessToken {\n    id\n    name\n    createdAt\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation accessTokenDelete($id: ID!) {\n    accessTokenDelete(id: $id) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation accessTokenDelete($id: ID!) {\n    accessTokenDelete(id: $id) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment DeleteTaskButton on Task {\n    id\n    hasWorkHours\n    title\n  }\n',
): (typeof documents)['\n  fragment DeleteTaskButton on Task {\n    id\n    hasWorkHours\n    title\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation taskDelete($id: ID!, $hasWorkHours: Boolean!) {\n    taskDelete(id: $id) @skip(if: $hasWorkHours) {\n      id\n    }\n    taskArchive(taskId: $id) @include(if: $hasWorkHours) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation taskDelete($id: ID!, $hasWorkHours: Boolean!) {\n    taskDelete(id: $id) @skip(if: $hasWorkHours) {\n      id\n    }\n    taskArchive(taskId: $id) @include(if: $hasWorkHours) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment LockTaskButton on Task {\n    id\n    isLockedByAdmin\n  }\n',
): (typeof documents)['\n  fragment LockTaskButton on Task {\n    id\n    isLockedByAdmin\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation taskUpdate($id: ID!, $data: TaskUpdateInput!) {\n    taskUpdate(id: $id, data: $data) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation taskUpdate($id: ID!, $data: TaskUpdateInput!) {\n    taskUpdate(id: $id, data: $data) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ArchiveOrUnarchiveOrganizationButton on Organization {\n    id\n    isArchived\n    ...UnarchiveOrganizationButton\n    ...ArchiveOrganizationButton\n  }\n',
): (typeof documents)['\n  fragment ArchiveOrUnarchiveOrganizationButton on Organization {\n    id\n    isArchived\n    ...UnarchiveOrganizationButton\n    ...ArchiveOrganizationButton\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ArchiveOrganizationButton on Organization {\n    id\n    title\n  }\n',
): (typeof documents)['\n  fragment ArchiveOrganizationButton on Organization {\n    id\n    title\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation organizationArchive($organizationId: ID!) {\n    organizationArchive(organizationId: $organizationId) {\n      id\n      isArchived\n    }\n  }\n',
): (typeof documents)['\n  mutation organizationArchive($organizationId: ID!) {\n    organizationArchive(organizationId: $organizationId) {\n      id\n      isArchived\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment UnarchiveOrganizationButton on Organization {\n    id\n    title\n  }\n',
): (typeof documents)['\n  fragment UnarchiveOrganizationButton on Organization {\n    id\n    title\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation organizationUnarchive($organizationId: ID!) {\n    organizationUnarchive(organizationId: $organizationId) {\n      id\n      isArchived\n    }\n  }\n',
): (typeof documents)['\n  mutation organizationUnarchive($organizationId: ID!) {\n    organizationUnarchive(organizationId: $organizationId) {\n      id\n      isArchived\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment OrganizationForm on Organization {\n    title\n    address\n    canModify\n    subscriptionStatus\n    ...ArchiveOrUnarchiveOrganizationButton\n    ...SubscribeOrUnsubscribeOrganizationButton\n  }\n',
): (typeof documents)['\n  fragment OrganizationForm on Organization {\n    title\n    address\n    canModify\n    subscriptionStatus\n    ...ArchiveOrUnarchiveOrganizationButton\n    ...SubscribeOrUnsubscribeOrganizationButton\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment SubscribeOrUnsubscribeOrganizationButton on Organization {\n    id\n    subscriptionStatus\n    ...UnsubscribeOrganizationButton\n  }\n',
): (typeof documents)['\n  fragment SubscribeOrUnsubscribeOrganizationButton on Organization {\n    id\n    subscriptionStatus\n    ...UnsubscribeOrganizationButton\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment UnsubscribeOrganizationButton on Organization {\n    id\n    title\n  }\n',
): (typeof documents)['\n  fragment UnsubscribeOrganizationButton on Organization {\n    id\n    title\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation organizationPaypalUnsubscribe($organizationId: ID!) {\n    organizationPaypalUnsubscribe(organizationId: $organizationId) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation organizationPaypalUnsubscribe($organizationId: ID!) {\n    organizationPaypalUnsubscribe(organizationId: $organizationId) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment OrganizationMemberListOrganization on Organization {\n    id\n    canModify\n    ...RemoveUserFromOrganizationButtonOrganization\n    members {\n      id\n      image\n      name\n      organizationRole(organizationId: $organizationId)\n      ...RemoveUserFromOrganizationButtonUser\n    }\n  }\n',
): (typeof documents)['\n  fragment OrganizationMemberListOrganization on Organization {\n    id\n    canModify\n    ...RemoveUserFromOrganizationButtonOrganization\n    members {\n      id\n      image\n      name\n      organizationRole(organizationId: $organizationId)\n      ...RemoveUserFromOrganizationButtonUser\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation organizationMembershipUpdate($organizationId: ID!, $userId: ID!, $organizationRole: Role!) {\n    organizationMembershipCreate(\n      organizationId: $organizationId\n      userId: $userId\n      organizationRole: $organizationRole\n    ) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation organizationMembershipUpdate($organizationId: ID!, $userId: ID!, $organizationRole: Role!) {\n    organizationMembershipCreate(\n      organizationId: $organizationId\n      userId: $userId\n      organizationRole: $organizationRole\n    ) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment RemoveUserFromOrganizationButtonUser on User {\n    id\n    name\n  }\n',
): (typeof documents)['\n  fragment RemoveUserFromOrganizationButtonUser on User {\n    id\n    name\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment RemoveUserFromOrganizationButtonOrganization on Organization {\n    id\n    title\n  }\n',
): (typeof documents)['\n  fragment RemoveUserFromOrganizationButtonOrganization on Organization {\n    id\n    title\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation OrganizationMembershipDelete($organizationId: ID!, $userId: ID!) {\n    organizationMembershipDelete(organizationId: $organizationId, userId: $userId) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation OrganizationMembershipDelete($organizationId: ID!, $userId: ID!) {\n    organizationMembershipDelete(organizationId: $organizationId, userId: $userId) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment OrganizationTableItem on Organization {\n    id\n    title\n  }\n',
): (typeof documents)['\n  fragment OrganizationTableItem on Organization {\n    id\n    title\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ArchiveProjectButton on Project {\n    id\n    title\n  }\n',
): (typeof documents)['\n  fragment ArchiveProjectButton on Project {\n    id\n    title\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectArchive($projectId: ID!) {\n    projectArchive(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n',
): (typeof documents)['\n  mutation projectArchive($projectId: ID!) {\n    projectArchive(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment DeleteOrArchiveProjectButton on Project {\n    id\n    hasWorkHours\n    isArchived\n    ...DeleteProjectButton\n    ...UnarchiveProjectButton\n    ...ArchiveProjectButton\n  }\n',
): (typeof documents)['\n  fragment DeleteOrArchiveProjectButton on Project {\n    id\n    hasWorkHours\n    isArchived\n    ...DeleteProjectButton\n    ...UnarchiveProjectButton\n    ...ArchiveProjectButton\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment DeleteProjectButton on Project {\n    id\n    title\n  }\n',
): (typeof documents)['\n  fragment DeleteProjectButton on Project {\n    id\n    title\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectDelete($id: ID!) {\n    projectDelete(id: $id) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation projectDelete($id: ID!) {\n    projectDelete(id: $id) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment UnarchiveProjectButton on Project {\n    id\n    title\n  }\n',
): (typeof documents)['\n  fragment UnarchiveProjectButton on Project {\n    id\n    title\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectUnarchive($projectId: ID!) {\n    projectUnarchive(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n',
): (typeof documents)['\n  mutation projectUnarchive($projectId: ID!) {\n    projectUnarchive(projectId: $projectId) {\n      id\n      isArchived\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ProjectForm on Project {\n    title\n    id\n    startDate\n    endDate\n    canModify\n    hasWorkHours\n    organization {\n      id\n      title\n      isArchived\n    }\n    ...DeleteOrArchiveProjectButton\n    ...ProjectInvitationButton\n  }\n',
): (typeof documents)['\n  fragment ProjectForm on Project {\n    title\n    id\n    startDate\n    endDate\n    canModify\n    hasWorkHours\n    organization {\n      id\n      title\n      isArchived\n    }\n    ...DeleteOrArchiveProjectButton\n    ...ProjectInvitationButton\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment Organization on Organization {\n    id\n    title\n    isArchived\n  }\n',
): (typeof documents)['\n  fragment Organization on Organization {\n    id\n    title\n    isArchived\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectMembershipInvitationCreate($projectId: ID!) {\n    projectMembershipInvitationCreate(projectId: $projectId) {\n      id\n      invitationKey\n      expireDate\n    }\n  }\n',
): (typeof documents)['\n  mutation projectMembershipInvitationCreate($projectId: ID!) {\n    projectMembershipInvitationCreate(projectId: $projectId) {\n      id\n      invitationKey\n      expireDate\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectMembershipCreate($projectId: ID!, $userId: ID!) {\n    projectMembershipCreate(projectId: $projectId, userId: $userId) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation projectMembershipCreate($projectId: ID!, $userId: ID!) {\n    projectMembershipCreate(projectId: $projectId, userId: $userId) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ProjectInvitationButton on Project {\n    id\n    title\n    members {\n      id\n      projectRole(projectId: $projectId)\n    }\n    organization {\n      title\n      members {\n        id\n        name\n        image\n      }\n    }\n  }\n',
): (typeof documents)['\n  fragment ProjectInvitationButton on Project {\n    id\n    title\n    members {\n      id\n      projectRole(projectId: $projectId)\n    }\n    organization {\n      title\n      members {\n        id\n        name\n        image\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ProjectMemberListProject on Project {\n    id\n    canModify\n    ...RemoveUserFromProjectButtonProject\n    members {\n      id\n      image\n      name\n      projectRole(projectId: $projectId)\n      ...RemoveUserFromProjectButtonUser\n    }\n  }\n',
): (typeof documents)['\n  fragment ProjectMemberListProject on Project {\n    id\n    canModify\n    ...RemoveUserFromProjectButtonProject\n    members {\n      id\n      image\n      name\n      projectRole(projectId: $projectId)\n      ...RemoveUserFromProjectButtonUser\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectMembershipUpdate($projectId: ID!, $userId: ID!, $projectRole: Role!) {\n    projectMembershipCreate(projectId: $projectId, userId: $userId, projectRole: $projectRole) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation projectMembershipUpdate($projectId: ID!, $userId: ID!, $projectRole: Role!) {\n    projectMembershipCreate(projectId: $projectId, userId: $userId, projectRole: $projectRole) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment RemoveUserFromProjectButtonUser on User {\n    id\n    name\n  }\n',
): (typeof documents)['\n  fragment RemoveUserFromProjectButtonUser on User {\n    id\n    name\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment RemoveUserFromProjectButtonProject on Project {\n    id\n    title\n  }\n',
): (typeof documents)['\n  fragment RemoveUserFromProjectButtonProject on Project {\n    id\n    title\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectMembershipDelete($projectId: ID!, $userId: ID!) {\n    projectMembershipDelete(projectId: $projectId, userId: $userId) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation projectMembershipDelete($projectId: ID!, $userId: ID!) {\n    projectMembershipDelete(projectId: $projectId, userId: $userId) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ProjectTableItem on Project {\n    id\n    title\n    startDate\n    endDate\n    members {\n      id\n      image\n      name\n    }\n  }\n',
): (typeof documents)['\n  fragment ProjectTableItem on Project {\n    id\n    title\n    startDate\n    endDate\n    members {\n      id\n      image\n      name\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectLock($date: MonthInput!, $projectId: ID!) {\n    projectLock(date: $date, projectId: $projectId) {\n      isLocked(date: $date)\n    }\n  }\n',
): (typeof documents)['\n  mutation projectLock($date: MonthInput!, $projectId: ID!) {\n    projectLock(date: $date, projectId: $projectId) {\n      isLocked(date: $date)\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectUnlock($date: MonthInput!, $projectId: ID!) {\n    projectUnlock(date: $date, projectId: $projectId) {\n      isLocked(date: $date)\n    }\n  }\n',
): (typeof documents)['\n  mutation projectUnlock($date: MonthInput!, $projectId: ID!) {\n    projectUnlock(date: $date, projectId: $projectId) {\n      isLocked(date: $date)\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ReportProject on Project {\n    id\n    title\n    canModify\n    isArchived\n    isLocked(date: $date)\n  }\n',
): (typeof documents)['\n  fragment ReportProject on Project {\n    id\n    title\n    canModify\n    isArchived\n    isLocked(date: $date)\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query reportProjects($from: Date!, $to: Date, $filter: ProjectFilter, $date: MonthInput!) {\n    projects(from: $from, to: $to, filter: $filter) {\n      ...ReportProject\n    }\n  }\n',
): (typeof documents)['\n  query reportProjects($from: Date!, $to: Date, $filter: ProjectFilter, $date: MonthInput!) {\n    projects(from: $from, to: $to, filter: $filter) {\n      ...ReportProject\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query report($projectId: ID!, $month: Int!, $year: Int!, $userId: ID, $groupByUser: Boolean!) {\n    project(projectId: $projectId) {\n      canModify\n    }\n    report(projectId: $projectId, month: $month, year: $year, userId: $userId) {\n      groupedByDate {\n        date\n        duration\n        workHours {\n          id\n          duration\n          comment\n          user {\n            id\n            name\n          }\n          task {\n            id\n            title\n          }\n        }\n      }\n      groupedByTask {\n        task {\n          id\n          title\n        }\n        duration\n      }\n      groupedByUser @include(if: $groupByUser) {\n        user {\n          id\n          name\n        }\n        duration\n      }\n    }\n  }\n',
): (typeof documents)['\n  query report($projectId: ID!, $month: Int!, $year: Int!, $userId: ID, $groupByUser: Boolean!) {\n    project(projectId: $projectId) {\n      canModify\n    }\n    report(projectId: $projectId, month: $month, year: $year, userId: $userId) {\n      groupedByDate {\n        date\n        duration\n        workHours {\n          id\n          duration\n          comment\n          user {\n            id\n            name\n          }\n          task {\n            id\n            title\n          }\n        }\n      }\n      groupedByTask {\n        task {\n          id\n          title\n        }\n        duration\n      }\n      groupedByUser @include(if: $groupByUser) {\n        user {\n          id\n          name\n        }\n        duration\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ReportUser on User {\n    id\n    name\n    image\n    durationWorkedOnProject(from: $from, to: $to, projectId: $projectId)\n  }\n',
): (typeof documents)['\n  fragment ReportUser on User {\n    id\n    name\n    image\n    durationWorkedOnProject(from: $from, to: $to, projectId: $projectId)\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query reportUsers($projectId: ID!, $from: Date!, $to: Date!) {\n    project(projectId: $projectId) {\n      id\n      members(includePastMembers: true) {\n        ...ReportUser\n      }\n    }\n  }\n',
): (typeof documents)['\n  query reportUsers($projectId: ID!, $from: Date!, $to: Date!) {\n    project(projectId: $projectId) {\n      id\n      members(includePastMembers: true) {\n        ...ReportUser\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment TaskListProject on Project {\n    id\n    canModify\n    tasks {\n      id\n      ...TaskRow\n    }\n  }\n',
): (typeof documents)['\n  fragment TaskListProject on Project {\n    id\n    canModify\n    tasks {\n      id\n      ...TaskRow\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation taskCreate($data: TaskInput!) {\n    taskCreate(data: $data) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation taskCreate($data: TaskInput!) {\n    taskCreate(data: $data) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment TaskRow on Task {\n    id\n    title\n    canModify\n    isLockedByAdmin\n    ...DeleteTaskButton\n    ...LockTaskButton\n  }\n',
): (typeof documents)['\n  fragment TaskRow on Task {\n    id\n    title\n    canModify\n    isLockedByAdmin\n    ...DeleteTaskButton\n    ...LockTaskButton\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment SheetDayRow on WorkHour {\n    id\n    duration\n    project {\n      title\n    }\n    task {\n      title\n    }\n    user {\n      name\n    }\n  }\n',
): (typeof documents)['\n  fragment SheetDayRow on WorkHour {\n    id\n    duration\n    project {\n      title\n    }\n    task {\n      title\n    }\n    user {\n      name\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query workHours($from: Date!, $to: Date) {\n    workHours(from: $from, to: $to) {\n      date\n      ...SheetDayRow\n    }\n  }\n',
): (typeof documents)['\n  query workHours($from: Date!, $to: Date) {\n    workHours(from: $from, to: $to) {\n      date\n      ...SheetDayRow\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query currentTracking {\n    currentTracking {\n      ...TrackingButtonsTracking\n      start\n      task {\n        title\n        project {\n          title\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query currentTracking {\n    currentTracking {\n      ...TrackingButtonsTracking\n      start\n      task {\n        title\n        project {\n          title\n        }\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment TrackingButtonsTracking on Tracking {\n    start\n    task {\n      id\n      title\n      project {\n        title\n      }\n    }\n  }\n',
): (typeof documents)['\n  fragment TrackingButtonsTracking on Tracking {\n    start\n    task {\n      id\n      title\n      project {\n        title\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment TrackingButtonsTask on Task {\n    id\n    isLocked\n  }\n',
): (typeof documents)['\n  fragment TrackingButtonsTask on Task {\n    id\n    isLocked\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation trackingStart($taskId: ID!) {\n    trackingStart(taskId: $taskId) {\n      start\n      task {\n        id\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation trackingStart($taskId: ID!) {\n    trackingStart(taskId: $taskId) {\n      start\n      task {\n        id\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation trackingStop {\n    trackingStop {\n      id\n      task {\n        id\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation trackingStop {\n    trackingStop {\n      id\n      task {\n        id\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation trackingCancel {\n    trackingCancel {\n      start\n      task {\n        id\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation trackingCancel {\n    trackingCancel {\n      start\n      task {\n        id\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ProjectMember on User {\n    id\n    name\n    image\n  }\n',
): (typeof documents)['\n  fragment ProjectMember on User {\n    id\n    name\n    image\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query MyProjectsMembers {\n    myProjectsMembers {\n      ...ProjectMember\n    }\n    user {\n      id\n    }\n  }\n',
): (typeof documents)['\n  query MyProjectsMembers {\n    myProjectsMembers {\n      ...ProjectMember\n    }\n    user {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment WeekGridProject on Project {\n    id\n    tasks {\n      workHourOfDays(from: $from, to: $to, projectMemberUserId: $projectMemberUserId) {\n        ...WeekGridFooter\n        workHour {\n          duration\n        }\n      }\n    }\n    ...WeekGridProjectRowGroup\n  }\n',
): (typeof documents)['\n  fragment WeekGridProject on Project {\n    id\n    tasks {\n      workHourOfDays(from: $from, to: $to, projectMemberUserId: $projectMemberUserId) {\n        ...WeekGridFooter\n        workHour {\n          duration\n        }\n      }\n    }\n    ...WeekGridProjectRowGroup\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment WeekGridFooter on WorkHourOfDay {\n    date\n    workHour {\n      duration\n    }\n  }\n',
): (typeof documents)['\n  fragment WeekGridFooter on WorkHourOfDay {\n    date\n    workHour {\n      duration\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment WeekGridProjectRowGroup on Project {\n    id\n    title\n    isArchived\n    tasks {\n      id\n      ...WeekGridTaskRow\n      workHourOfDays(from: $from, to: $to, projectMemberUserId: $projectMemberUserId) {\n        workHour {\n          duration\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  fragment WeekGridProjectRowGroup on Project {\n    id\n    title\n    isArchived\n    tasks {\n      id\n      ...WeekGridTaskRow\n      workHourOfDays(from: $from, to: $to, projectMemberUserId: $projectMemberUserId) {\n        workHour {\n          duration\n        }\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation workHourUpdate($data: WorkHourInput!, $date: Date!, $taskId: ID!, $projectMemberUserId: ID) {\n    workHourUpdate(data: $data, date: $date, taskId: $taskId, projectMemberUserId: $projectMemberUserId) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation workHourUpdate($data: WorkHourInput!, $date: Date!, $taskId: ID!, $projectMemberUserId: ID) {\n    workHourUpdate(data: $data, date: $date, taskId: $taskId, projectMemberUserId: $projectMemberUserId) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment WeekGridTaskRow on Task {\n    id\n    title\n    project {\n      startDate\n      endDate\n    }\n    workHourOfDays(from: $from, to: $to, projectMemberUserId: $projectMemberUserId) {\n      date\n      workHour {\n        duration\n      }\n      isLocked\n    }\n    project {\n      id\n      isProjectMember\n      isArchived\n    }\n    tracking {\n      ...TrackingButtonsTracking\n    }\n    isLockedByAdmin\n    ...TrackingButtonsTask\n    ...WorkHourCommentFragment\n  }\n',
): (typeof documents)['\n  fragment WeekGridTaskRow on Task {\n    id\n    title\n    project {\n      startDate\n      endDate\n    }\n    workHourOfDays(from: $from, to: $to, projectMemberUserId: $projectMemberUserId) {\n      date\n      workHour {\n        duration\n      }\n      isLocked\n    }\n    project {\n      id\n      isProjectMember\n      isArchived\n    }\n    tracking {\n      ...TrackingButtonsTracking\n    }\n    isLockedByAdmin\n    ...TrackingButtonsTask\n    ...WorkHourCommentFragment\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment WorkHourCommentFragment on Task {\n    id\n    title\n    workHourOfDays(from: $from, to: $to, projectMemberUserId: $projectMemberUserId) {\n      date\n      workHour {\n        comment\n      }\n      isLocked\n    }\n  }\n',
): (typeof documents)['\n  fragment WorkHourCommentFragment on Task {\n    id\n    title\n    workHourOfDays(from: $from, to: $to, projectMemberUserId: $projectMemberUserId) {\n      date\n      workHour {\n        comment\n      }\n      isLocked\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation commentUpdate($comment: String!, $date: Date!, $taskId: ID!) {\n    workHourCommentUpdate(date: $date, taskId: $taskId, comment: $comment) {\n      comment\n    }\n  }\n',
): (typeof documents)['\n  mutation commentUpdate($comment: String!, $date: Date!, $taskId: ID!) {\n    workHourCommentUpdate(date: $date, taskId: $taskId, comment: $comment) {\n      comment\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query accessTokens {\n    accessTokens {\n      id\n      ...AccessTokenRow\n    }\n  }\n',
): (typeof documents)['\n  query accessTokens {\n    accessTokens {\n      id\n      ...AccessTokenRow\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation accessTokenCreate($name: String!) {\n    accessTokenCreate(name: $name)\n  }\n',
): (typeof documents)['\n  mutation accessTokenCreate($name: String!) {\n    accessTokenCreate(name: $name)\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation organizationPaypalSubscriptionIdCreate($organizationId: ID!, $returnUrl: String!, $cancelUrl: String!) {\n    organizationPaypalSubscriptionIdCreate(\n      organizationId: $organizationId\n      returnUrl: $returnUrl\n      cancelUrl: $cancelUrl\n    )\n  }\n',
): (typeof documents)['\n  mutation organizationPaypalSubscriptionIdCreate($organizationId: ID!, $returnUrl: String!, $cancelUrl: String!) {\n    organizationPaypalSubscriptionIdCreate(\n      organizationId: $organizationId\n      returnUrl: $returnUrl\n      cancelUrl: $cancelUrl\n    )\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query organizationDetails($organizationId: ID!) {\n    organization(organizationId: $organizationId) {\n      id\n      title\n    }\n  }\n',
): (typeof documents)['\n  query organizationDetails($organizationId: ID!) {\n    organization(organizationId: $organizationId) {\n      id\n      title\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment Invoice on Invoice {\n    id\n    invoiceDate\n    customerName\n    invoiceItems {\n      id\n      duration\n      hourlyRate\n    }\n  }\n',
): (typeof documents)['\n  fragment Invoice on Invoice {\n    id\n    invoiceDate\n    customerName\n    invoiceItems {\n      id\n      duration\n      hourlyRate\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query organization($organizationId: ID!) {\n    organization(organizationId: $organizationId) {\n      id\n      canModify\n      ...OrganizationForm\n      ...OrganizationMemberListOrganization\n      projects {\n        ...ProjectTableItem\n      }\n      invoices {\n        ...Invoice\n      }\n    }\n  }\n',
): (typeof documents)['\n  query organization($organizationId: ID!) {\n    organization(organizationId: $organizationId) {\n      id\n      canModify\n      ...OrganizationForm\n      ...OrganizationMemberListOrganization\n      projects {\n        ...ProjectTableItem\n      }\n      invoices {\n        ...Invoice\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation organizationUpdate($id: ID!, $data: OrganizationInput!) {\n    organizationUpdate(id: $id, data: $data) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation organizationUpdate($id: ID!, $data: OrganizationInput!) {\n    organizationUpdate(id: $id, data: $data) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment InvoiceFragment on Invoice {\n    id\n    invoiceDate\n    customerName\n    customerAddress\n    payDate\n    sendDate\n    invoiceStatus\n  }\n',
): (typeof documents)['\n  fragment InvoiceFragment on Invoice {\n    id\n    invoiceDate\n    customerName\n    customerAddress\n    payDate\n    sendDate\n    invoiceStatus\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment InvoiceItemsFragment on InvoiceItem {\n    id\n    duration\n    hourlyRate\n    task {\n      title\n    }\n  }\n',
): (typeof documents)['\n  fragment InvoiceItemsFragment on InvoiceItem {\n    id\n    duration\n    hourlyRate\n    task {\n      title\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query invoice($invoiceId: ID!, $organizationId: ID!) {\n    invoice(invoiceId: $invoiceId, organizationId: $organizationId) {\n      ...InvoiceFragment\n      invoiceItems {\n        ...InvoiceItemsFragment\n      }\n    }\n  }\n',
): (typeof documents)['\n  query invoice($invoiceId: ID!, $organizationId: ID!) {\n    invoice(invoiceId: $invoiceId, organizationId: $organizationId) {\n      ...InvoiceFragment\n      invoiceItems {\n        ...InvoiceItemsFragment\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query myOrganizations($filter: OrganizationFilter) {\n    organizations(filter: $filter) {\n      ...OrganizationTableItem\n    }\n  }\n',
): (typeof documents)['\n  query myOrganizations($filter: OrganizationFilter) {\n    organizations(filter: $filter) {\n      ...OrganizationTableItem\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query organizationCounts {\n    allCounts: organizationsCount(filter: ALL)\n    activeCounts: organizationsCount(filter: ACTIVE)\n    archivedCounts: organizationsCount(filter: ARCHIVED)\n  }\n',
): (typeof documents)['\n  query organizationCounts {\n    allCounts: organizationsCount(filter: ALL)\n    activeCounts: organizationsCount(filter: ACTIVE)\n    archivedCounts: organizationsCount(filter: ARCHIVED)\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation organizationCreate($data: OrganizationInput!) {\n    organizationCreate(data: $data) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation organizationCreate($data: OrganizationInput!) {\n    organizationCreate(data: $data) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query project($projectId: ID!) {\n    project(projectId: $projectId) {\n      id\n      ...TaskListProject\n      ...ProjectForm\n      ...ProjectMemberListProject\n    }\n    organizations {\n      ...Organization\n    }\n  }\n',
): (typeof documents)['\n  query project($projectId: ID!) {\n    project(projectId: $projectId) {\n      id\n      ...TaskListProject\n      ...ProjectForm\n      ...ProjectMemberListProject\n    }\n    organizations {\n      ...Organization\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectUpdate($id: ID!, $data: ProjectInput!) {\n    projectUpdate(id: $id, data: $data) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation projectUpdate($id: ID!, $data: ProjectInput!) {\n    projectUpdate(id: $id, data: $data) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query myProjects($from: Date!, $filter: ProjectFilter) {\n    projects(from: $from, filter: $filter) {\n      ...ProjectTableItem\n    }\n  }\n',
): (typeof documents)['\n  query myProjects($from: Date!, $filter: ProjectFilter) {\n    projects(from: $from, filter: $filter) {\n      ...ProjectTableItem\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query projectCounts($from: Date!, $to: Date) {\n    allCounts: projectsCount(from: $from, to: $to, filter: ALL)\n    activeCounts: projectsCount(from: $from, to: $to, filter: ACTIVE)\n    futureCounts: projectsCount(from: $from, to: $to, filter: FUTURE)\n    pastCounts: projectsCount(from: $from, to: $to, filter: PAST)\n    archivedCounts: projectsCount(from: $from, to: $to, filter: ARCHIVED)\n  }\n',
): (typeof documents)['\n  query projectCounts($from: Date!, $to: Date) {\n    allCounts: projectsCount(from: $from, to: $to, filter: ALL)\n    activeCounts: projectsCount(from: $from, to: $to, filter: ACTIVE)\n    futureCounts: projectsCount(from: $from, to: $to, filter: FUTURE)\n    pastCounts: projectsCount(from: $from, to: $to, filter: PAST)\n    archivedCounts: projectsCount(from: $from, to: $to, filter: ARCHIVED)\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectMembershipJoin($invitationKey: String!) {\n    projectMembershipJoin(invitationKey: $invitationKey) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation projectMembershipJoin($invitationKey: String!) {\n    projectMembershipJoin(invitationKey: $invitationKey) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation projectCreate($data: ProjectInput!) {\n    projectCreate(data: $data) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation projectCreate($data: ProjectInput!) {\n    projectCreate(data: $data) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query organizations {\n    organizations {\n      ...Organization\n    }\n  }\n',
): (typeof documents)['\n  query organizations {\n    organizations {\n      ...Organization\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query weekGrid($from: Date!, $to: Date, $projectMemberUserId: ID) {\n    projects(\n      from: $from\n      to: $to\n      projectMemberUserId: $projectMemberUserId\n      includeProjectsWhereUserBookedWorkHours: true\n    ) {\n      ...WeekGridProject\n    }\n  }\n',
): (typeof documents)['\n  query weekGrid($from: Date!, $to: Date, $projectMemberUserId: ID) {\n    projects(\n      from: $from\n      to: $to\n      projectMemberUserId: $projectMemberUserId\n      includeProjectsWhereUserBookedWorkHours: true\n    ) {\n      ...WeekGridProject\n    }\n  }\n']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
