import { useRouter } from 'next/router'
import { ProjectForm } from '../../../frontend/components/projectForm/projectForm'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { ProjectInput, useProjectCreateMutation } from '../../../frontend/generated/graphql'

const NewProjectPage = (): JSX.Element => {
  const [, projectCreate] = useProjectCreateMutation()
  const router = useRouter()

  const handleSubmit = async (data: ProjectInput) => {
    try {
      const result = await projectCreate({ data })
      if (result.error) {
        throw new Error('graphql error')
      }
      await router.push(`/${router.query.teamSlug}/projects`)
    } catch {}
  }

  const handleCancel = async () => {
    await router.push(`/${router.query.teamSlug}/projects`)
  }

  return (
    <ProtectedPage>
      <ProjectForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </ProtectedPage>
  )
}

export default NewProjectPage
