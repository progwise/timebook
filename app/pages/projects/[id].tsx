import { useRouter } from 'next/router'
import { ProjectForm } from '../../frontend/components/projectForm/projectForm'
import { ProtectedPage } from '../../frontend/components/protectedPage'
import { ProjectInput, useProjectQuery, useProjectUpdateMutation } from '../../frontend/generated/graphql'
import { TaskForm } from '../../frontend/components/taskForm/taskForm'
import React from 'react'
import { TaskList } from '../../frontend/components/taskList.tsx/taskList'

const ProjectDetails = (): JSX.Element => {
  const router = useRouter()
  const { id } = router.query
  if (!id || !Number.parseInt(id.toString())) {
    return <div>Loading...</div>
  }
  const [{ data, fetching }] = useProjectQuery({ variables: { projectId: Number.parseInt(id.toString()) } })
  const selectedProject = data?.project
  const [, projectUpdate] = useProjectUpdateMutation()

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

  if (fetching) {
    return <div>Loading...</div>
  }

  if (!selectedProject) {
    return <div>Project not found</div>
  }

  return (
    <ProtectedPage>
      <article>
        <ProjectForm project={selectedProject} onCancel={handleCancel} onSubmit={handleSubmit} />
      </article>
      <article>
        <TaskList tasks={selectedProject.tasks} />
      </article>
    </ProtectedPage>
  )
}

export default ProjectDetails
