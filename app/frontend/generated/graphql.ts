/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable  @typescript-eslint/explicit-module-boundary-types */
import gql from 'graphql-tag'
import * as Urql from 'urql'
export type Maybe<T> = T | null
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

export type Mutation = {
    __typename?: 'Mutation'
    /** Create a new WorkHour */
    createWorkHour: WorkHour
    /** Create a new project */
    projectCreate: Project
    /** Delete a project */
    projectDelete: Project
    /** Update a project */
    projectUpdate: Project
}

export type MutationCreateWorkHourArgs = {
    comment?: Maybe<Scalars['String']>
    date: Scalars['Date']
    duration: Scalars['Int']
    taskId: Scalars['ID']
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

export type Project = {
    __typename?: 'Project'
    endDate?: Maybe<Scalars['Date']>
    /** identifies the project */
    id: Scalars['ID']
    startDate?: Maybe<Scalars['Date']>
    title: Scalars['String']
    workHours: Array<WorkHour>
}

export type ProjectInput = {
    end?: Maybe<Scalars['Date']>
    start?: Maybe<Scalars['Date']>
    title: Scalars['String']
}

export type Query = {
    __typename?: 'Query'
    /** Returns a list of all projects */
    projects: Array<Project>
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
}

export type ProjectsQueryVariables = Exact<{ [key: string]: never }>

export type ProjectsQuery = {
    __typename?: 'Query'
    projects: Array<{
        __typename?: 'Project'
        id: string
        title: string
        startDate?: string | null | undefined
        endDate?: string | null | undefined
    }>
}

export type ProjectFragment = {
    __typename?: 'Project'
    id: string
    title: string
    startDate?: string | null | undefined
    endDate?: string | null | undefined
}

export const ProjectFragmentDoc = gql`
    fragment Project on Project {
        id
        title
        startDate
        endDate
    }
`
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
