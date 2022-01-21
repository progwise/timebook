/* eslint-disable unicorn/consistent-function-scoping */
import { InputField } from '../../../frontend/components/inputField/inputField'
import { Button } from '../../../frontend/components/button/button'
import { useForm } from 'react-hook-form'
import { CustomerInput, useCustomerCreateMutation } from '../../../frontend/generated/graphql'
import router from 'next/router'
import { ErrorMessage } from '@hookform/error-message'

const ReportsPage = (): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerInput>({ defaultValues: { title: '' } })
  const [, addCustomer] = useCustomerCreateMutation()
  const handleCancel = async () => {
    await router.push(`/${router.query.teamSlug}/customers`)
  }
  const onSubmit = async (data: CustomerInput) => {
    try {
      const result = await addCustomer({ data })
      if (result.error) {
        throw new Error('graphql error')
      }

      await router.push(`/${router.query.teamSlug}/customers`)
    } catch {}
  }

  return (
    <>
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
          <div className="flex justify-center mt-16 gap-2">
            <Button type="button" variant="secondary" tooltip="Cancel the changes" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" tooltip="Save changes">
              Save
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default ReportsPage
