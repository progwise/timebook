import { useRouter } from 'next/router'
import { useState } from 'react'
import { ProjectForm } from '../../../frontend/components/projectForm/projectForm'
import { ProtectedPage } from '../../../frontend/components/protectedPage'
import { ProjectInput, useProjectCreateMutation } from '../../../frontend/generated/graphql'

const NewProjectPage = (): JSX.Element => {
  const [, projectCreate] = useProjectCreateMutation()
  const router = useRouter()

  const [isError, setIsError] = useState(false)

  const handleSubmit = async (data: ProjectInput) => {
    setIsError(false)
    try {
      const result = await projectCreate({ data })
      if (result.error) {
        throw new Error('graphql error')
      }
      await router.push(`/${router.query.teamSlug}/projects`)
    } catch {
      setIsError(true)
    }
  }

  const handleCancel = async () => {
    await router.push(`/${router.query.teamSlug}/projects`)
  }

  return (
    <ProtectedPage>
      <ProjectForm onSubmit={handleSubmit} onCancel={handleCancel} hasError={isError} />
    </ProtectedPage>
  )
}

export default NewProjectPage
