import { useRouter } from 'next/router'
import { useMutation } from 'urql'

import { ProjectForm } from '../../frontend/components/projectForm/projectForm'
import { ProtectedPage } from '../../frontend/components/protectedPage'
import { graphql } from '../../frontend/generated/gql'
import { ProjectInput } from '../../frontend/generated/gql/graphql'

const ProjectCreateMutationDocument = graphql(`
  mutation projectCreate($data: ProjectInput!) {
    projectCreate(data: $data) {
      id
    }
  }
`)

const NewProjectPage = (): JSX.Element => {
  const [projectCreateResult, projectCreate] = useMutation(ProjectCreateMutationDocument)
  const router = useRouter()

  const handleSubmit = async (data: ProjectInput) => {
    try {
      const result = await projectCreate({ data })
      if (result.error) {
        throw new Error('graphql error')
      }
      await router.push('/projects')
    } catch {}
  }

  const handleCancel = async () => {
    await router.push('/projects')
  }

  return (
    <ProtectedPage>
      <ProjectForm onSubmit={handleSubmit} onCancel={handleCancel} hasError={!!projectCreateResult.error} />
    </ProtectedPage>
  )
}

export default NewProjectPage
