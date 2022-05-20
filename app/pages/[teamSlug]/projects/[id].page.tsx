import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { ProjectForm } from '../../../frontend/components/projectForm/projectForm'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { TaskList } from '../../../frontend/components/taskList/taskList'
import { ProjectInput, useProjectQuery, useProjectUpdateMutation } from '../../../frontend/generated/graphql'

const ProjectDetails = (): JSX.Element => {
  const router = useRouter()
  const { id, teamSlug } = router.query
  const context = useMemo(() => ({ additionalTypenames: ['Task'] }), [])
  const [{ data, fetching }] = useProjectQuery({
    variables: { projectId: id?.toString() ?? '' },
    context,
    pause: !router.isReady,
  })

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
      await router.push(`/${teamSlug}/projects`)
    } catch {}
  }

  const handleCancel = async () => {
    await router.push(`/${teamSlug}/projects`)
  }

  if (!router.isReady || fetching) {
    return <div>Loading...</div>
  }

  if (!selectedProject) {
    return <div>{`Project ${id} not found`}</div>
  }

  return (
    <ProtectedPage>
      <ProjectForm project={selectedProject} onCancel={handleCancel} onSubmit={handleSubmit} hasError={false} />
      <TaskList className="mt-10" project={selectedProject} tasks={selectedProject.tasks} />
    </ProtectedPage>
  )
}

export default ProjectDetails
