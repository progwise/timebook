import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useMutation, useQuery } from 'urql'

import { ProjectForm } from '../../frontend/components/projectForm/projectForm'
import { ProjectMemberList } from '../../frontend/components/projectMemberList'
import { ProtectedPage } from '../../frontend/components/protectedPage'
import { TaskList } from '../../frontend/components/taskList/taskList'
import { graphql } from '../../frontend/generated/gql'
import { ProjectInput } from '../../frontend/generated/gql/graphql'

const ProjectQueryDocument = graphql(`
  query project($projectId: ID!) {
    project(projectId: $projectId) {
      id
      ...TaskListProject
      members {
        ...ProjectMemberListUser
      }
      ...ProjectForm
    }
  }
`)

const ProjectUpdateMutationDocument = graphql(`
  mutation projectUpdate($id: ID!, $data: ProjectInput!) {
    projectUpdate(id: $id, data: $data) {
      id
    }
  }
`)

const ProjectDetails = (): JSX.Element => {
  const router = useRouter()
  const { id } = router.query
  const context = useMemo(() => ({ additionalTypenames: ['Task', 'User'] }), [])
  const [{ data, fetching }] = useQuery({
    query: ProjectQueryDocument,
    variables: { projectId: id?.toString() ?? '' },
    context,
    pause: !router.isReady,
  })

  const selectedProject = data?.project
  const [projectUpdateResult, projectUpdate] = useMutation(ProjectUpdateMutationDocument)

  const handleSubmit = async (data: ProjectInput) => {
    try {
      if (!selectedProject?.id) {
        throw new Error('project id missing')
      }
      const result = await projectUpdate({ id: selectedProject.id, data })
      if (result.error) {
        throw new Error('graphql error')
      }
      await router.push('/projects')
    } catch {}
  }

  const handleCancel = async () => {
    await router.push('/projects')
  }

  if (!router.isReady || fetching) {
    return <div>Loading...</div>
  }

  if (!selectedProject) {
    return <div>{`Project ${id} not found`}</div>
  }

  return (
    <ProtectedPage>
      <ProjectForm
        project={selectedProject}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        hasError={!!projectUpdateResult.error}
      />
      <TaskList className="mt-10" project={selectedProject} />
      <ProjectMemberList users={selectedProject.members} />
    </ProtectedPage>
  )
}

export default ProjectDetails
