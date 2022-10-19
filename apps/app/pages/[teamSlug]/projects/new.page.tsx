import { useRouter } from 'next/router'

import { ProjectForm } from '../../../frontend/components/projectForm/projectForm'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { ProjectInput, useProjectCreateMutation } from '../../../frontend/generated/graphql'

const NewProjectPage = (): JSX.Element => {
  const [projectCreateResult, projectCreate] = useProjectCreateMutation()
  const router = useRouter()
  const teamSlug = router.query.teamSlug?.toString() ?? ''

  const handleSubmit = async (data: ProjectInput) => {
    try {
      const result = await projectCreate({ data, teamSlug })
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
      <ProjectForm onSubmit={handleSubmit} onCancel={handleCancel} hasError={!!projectCreateResult.error} />
    </ProtectedPage>
  )
}

export default NewProjectPage
