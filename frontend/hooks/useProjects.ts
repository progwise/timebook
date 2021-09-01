import { CombinedError, useQuery } from 'urql'

export interface IProject {
    id: string
    title: string
    startDate: Date
    endDate: Date
    workhours: Array<{comment: string, date: Date, hours: number}>
}

const projectQuery = `
  query {
   projects {
     id
     title
     startDate
     endDate
     workhours {
      comment
      id
      date
      hours
    }
   }
}
`

export interface IUseProjectsResult {
    projects: Array<IProject>
    fetching: boolean
    error?: CombinedError
}

export const useProjects = (): IUseProjectsResult => {
    const [queryResult] = useQuery<{ projects: IProject[] }>({ query: projectQuery })
    const { data, fetching, error } = queryResult
    const projects = data && data.projects ? data.projects : []
    return { projects, fetching, error }
}
