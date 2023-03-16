import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AiOutlinePlus } from 'react-icons/ai'
import { useMutation } from 'urql'
import { z } from 'zod'

import { Button, InputField } from '@progwise/timebook-ui'

import { graphql } from '../generated/gql'

interface AddProjectMemberProps {
  projectId: string
}

interface FormState {
  email: string
}

const ProjectMembershipCreateByEmailDocument = graphql(`
  mutation projectMembershipCreateByEmail($email: String!, $projectId: ID!) {
    projectMembershipCreateByEmail(email: $email, projectId: $projectId) {
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

export const AddProjectMember = (props: AddProjectMemberProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormState>({
    defaultValues: { email: '' },
    resolver: zodResolver(formSchema),
  })
  const [, addProjectMember] = useMutation(ProjectMembershipCreateByEmailDocument)

  const handleUserInviteSubmit = async (data: FormState) => {
    const result = await addProjectMember({ email: data.email, projectId: props.projectId })

    if (result.error) {
      setError('email', { message: result.error.graphQLErrors.at(0)?.message ?? result.error.message })
      return
    }

    reset()
  }

  return (
    <form className="flex w-full items-center gap-2" onSubmit={handleSubmit(handleUserInviteSubmit)}>
      <Button type="submit" disabled={isSubmitting} variant="primary" className=" flex h-16 w-16 rounded-full">
        <AiOutlinePlus className="fill-white" size="2.5em" />
      </Button>
      <InputField
        {...register('email')}
        disabled={isSubmitting}
        errorMessage={errors.email?.message}
        type="email"
        variant="primary"
        placeholder="Enter a email address to join a Member to the project"
        className=" dark:bg-slate-800 dark:text-white"
      />
    </form>
  )
}
