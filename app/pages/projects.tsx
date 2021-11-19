import React from 'react'
import { useRouter } from 'next/router'
import { ProtectedPage } from '../frontend/components/protectedPage'
import { useProjectsQuery } from '../frontend/generated/graphql'
import { ProjectTable } from '../frontend/components/projectTable'

const Projects = (): JSX.Element => {
  const [{ data, error }] = useProjectsQuery()
  const router = useRouter()

  const handleAddProject = async () => {
    await router.push('/projects/new')
  }

  return (
    <ProtectedPage>
      <article>
        <h2 className="flex justify-between">
          <span>Your projects</span>
          <span>
            <button className="btn btn-gray1" onClick={handleAddProject}>
              Add
            </button>
          </span>
        </h2>

        {error && <span>{error.message}</span>}
        {!data?.projects ? <div>...loading</div> : <ProjectTable projects={data.projects} />}
      </article>
    </ProtectedPage>
  )
}

export default Projects
