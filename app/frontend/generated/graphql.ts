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
}

export type Mutation = {
    __typename?: 'Mutation'
    /** Create a new WorkHour */
    createWorkHour: WorkHour
}

export type MutationCreateWorkHourArgs = {
    comment?: Maybe<Scalars['String']>
    date: Scalars['Date']
    hours: Scalars['Float']
    projectId: Scalars['ID']
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

export type Query = {
    __typename?: 'Query'
    /** Returns a list of all projects */
    projects: Array<Project>
}

export type WorkHour = {
    __typename?: 'WorkHour'
    comment?: Maybe<Scalars['String']>
    date: Scalars['Date']
    hours: Scalars['Float']
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
