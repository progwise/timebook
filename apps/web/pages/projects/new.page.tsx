import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useMutation, useQuery } from 'urql'

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

export const OrganizationsQueryDocument = graphql(`
  query organizations {
    organizations {
      ...Organization
    }
  }
`)

const NewProjectPage = (): JSX.Element => {
  const [projectCreateResult, projectCreate] = useMutation(ProjectCreateMutationDocument)
  const router = useRouter()
  const context = useMemo(() => ({ additionalTypenames: ['Task', 'User'] }), [])
  const [{ data }] = useQuery({
    query: OrganizationsQueryDocument,
    context,
    pause: !router.isReady,
  })

  const organizations = data?.organizations || []

  const handleSubmit = async (data: ProjectInput) => {
    try {
      const result = await projectCreate({ data })
      if (result.error) {
        throw new Error('graphql error')
      }
      const projectId = result.data?.projectCreate.id
      await router.push(`/projects/${projectId}`)
    } catch {}
  }

  const handleCancel = async () => {
    await router.push('/projects')
  }

  return (
    <ProtectedPage>
      <ProjectForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        hasError={!!projectCreateResult.error}
        organizations={organizations}
      />
    </ProtectedPage>
  )
}

export default NewProjectPage
