import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation } from 'urql'
import { z } from 'zod'

import { Button, InputField } from '@progwise/timebook-ui'

import { graphql } from '../generated/gql'

interface AddProjectMemberFormProps {
  projectId: string
}

interface InviteFormState {
  email: string
}

const projectMembershipInviteByEmailMutationFieldDocument = graphql(`
  mutation projectMembershipInviteByEmail($email: String!, $projectId: ID!) {
    projectMembershipInviteByEmail(email: $email, projectId: $projectId) {
      title
      members {
        name
      }
    }
  }
`)

const formSchema = z.object({
  email: z.string().trim().email().min(1).max(50),
})

export const AddProjectMemberForm = (props: AddProjectMemberFormProps) => {
  const { register, handleSubmit, reset, formState, setError } = useForm<InviteFormState>({
    defaultValues: { email: '' },
    resolver: zodResolver(formSchema),
  })

  const { isSubmitting, errors, isDirty } = formState

  const [, addProjectMember] = useMutation(projectMembershipInviteByEmailMutationFieldDocument)

  const handleUserInviteSubmit = async (data: InviteFormState) => {
    const result = await addProjectMember({ email: data.email, projectId: props.projectId })

    if (result.error) {
      setError('email', { message: result.error.graphQLErrors.at(0)?.message ?? result.error.message })
      return
    }

    reset()
  }

  return (
    <form className="flex w-full items-center gap-2" onSubmit={handleSubmit(handleUserInviteSubmit)}>
      <Button type="submit" disabled={isSubmitting} variant="primary" className="h-16 w-16 rounded-full">
        <AiOutlinePlus className="h-10 w-10 fill-white" />
      </Button>
      <InputField
        {...register('email')}
        disabled={isSubmitting}
        errorMessage={errors.email?.message}
        type="email"
        variant="primary"
        placeholder="Email address to invite someone"
        className=" dark:bg-slate-800 dark:text-white"
        isDirty={isDirty}
      />
    </form>
  )
}
