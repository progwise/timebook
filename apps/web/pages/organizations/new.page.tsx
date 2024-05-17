import { useRouter } from 'next/router'
import { useMutation } from 'urql'

import { OrganizationForm } from '../../frontend/components/organizationForm/organizationForm'
import { ProtectedPage } from '../../frontend/components/protectedPage'
import { graphql } from '../../frontend/generated/gql'
import { OrganizationInput } from '../../frontend/generated/gql/graphql'

const OrganizationCreateMutationDocument = graphql(`
  mutation organizationCreate($data: OrganizationInput!) {
    organizationCreate(data: $data) {
      id
    }
  }
`)

const NewOrganizationPage = (): JSX.Element => {
  const [organizationCreateResult, organizationCreate] = useMutation(OrganizationCreateMutationDocument)
  const router = useRouter()

  const handleSubmit = async (data: OrganizationInput) => {
    try {
      const result = await organizationCreate({ data })
      if (result.error) {
        throw new Error('graphql error')
      }
      const organizationId = result.data?.organizationCreate.id
      await router.push(`/organizations/${organizationId}`)
    } catch {}
  }

  const handleCancel = async () => {
    await router.push('/organizations')
  }

  return (
    <ProtectedPage>
      <OrganizationForm onSubmit={handleSubmit} onCancel={handleCancel} hasError={!!organizationCreateResult.error} />
    </ProtectedPage>
  )
}

export default NewOrganizationPage
