import { InputField } from '../../../frontend/components/inputField/inputField'
import { Button } from '../../../frontend/components/button/button'
import { useForm } from 'react-hook-form'
import { CustomerInput, useCustomerCreateMutation } from '../../../frontend/generated/graphql'
import { useRouter } from 'next/router'
import { ErrorMessage } from '@hookform/error-message'
import { ProtectedPage } from '../../../frontend/components/protectedPage'

const ReportsPage = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInput>({ defaultValues: { title: '' } })
  const [, addCustomer] = useCustomerCreateMutation()
  const router = useRouter()
  const onSubmit = async (data: CustomerInput) => {
    try {
      const result = await addCustomer({ data })
      if (result.error) {
        throw new Error('graphql error')
      }

      await router.push(`/${router.query.teamSlug}/customers`)
    } catch {}
  }
  const handleCancel = async () => {
    await router.push(`/${router.query.teamSlug}/customers`)
  }
  return (
    <ProtectedPage>
      <div>
        <h1>Add a customer</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="text-gray-500">
            <InputField
              placeholder="Name"
              variant="primary"
              {...register('title', { required: 'title is required' })}
            />
            <ErrorMessage name="title" errors={errors} />
          </label>
          <div className="mt-16 flex justify-center gap-2">
            <Button
              ariaLabel="Cancel"
              type="button"
              variant="secondary"
              tooltip="Cancel the changes"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button ariaLabel="Save" type="submit" variant="primary" tooltip="Save changes">
              Save
            </Button>
          </div>
        </form>
      </div>
    </ProtectedPage>
  )
}

export default ReportsPage
