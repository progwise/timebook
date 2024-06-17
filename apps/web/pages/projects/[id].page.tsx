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
      ...ProjectForm
      ...ProjectMemberListProject
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
    return <div>Project {id} not found</div>
  }

  return (
    <ProtectedPage>
      <ProjectForm
        project={selectedProject}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        hasError={!!projectUpdateResult.error}
      />
      <div role="tablist" className="tabs tabs-lifted tabs-lg">
        <input type="radio" name="tab" role="tab" className="tab" aria-label="Tasks" defaultChecked />
        <div role="tabpanel" className="tab-content rounded-box border-base-300 bg-base-100 p-6">
          <TaskList project={selectedProject} />
        </div>
        <input type="radio" name="tab" role="tab" className="tab" aria-label="Members" />
        <div role="tabpanel" className="tab-content rounded-box border-base-300 bg-base-100 p-6">
          <ProjectMemberList project={selectedProject} />
        </div>
      </div>
    </ProtectedPage>
  )
}

export default ProjectDetails
