import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { BiPlus } from 'react-icons/bi'
import { useMutation } from 'urql'
import { z } from 'zod'

import { InputField } from '@progwise/timebook-ui'

import { graphql, FragmentType, useFragment } from '../generated/gql'

const AddProjectMemberFormFragment = graphql(`
  fragment AddProjectMemberForm on Project {
    id
    inviteKey
    title
  }
`)

interface AddProjectMemberFormProps {
  project: FragmentType<typeof AddProjectMemberFormFragment>
}

interface InviteFormState {
  email: string
}

const projectMembershipInviteByEmailMutationFieldDocument = graphql(`
  mutation projectMembershipInviteByEmail($email: String!, $projectId: ID!) {
    projectMembershipInviteByEmail(email: $email, projectId: $projectId) {
      ... on MutationProjectMembershipInviteByEmailSuccess {
        data {
          title
          members {
            name
          }
        }
      }
      ... on UserNotFoundError {
        email
      }
      __typename
    }
  }
`)

const formSchema = z.object({
  email: z.string().trim().email().min(1).max(50),
})

export const AddProjectMemberForm = (props: AddProjectMemberFormProps) => {
  const project = useFragment(AddProjectMemberFormFragment, props.project)
  const { register, handleSubmit, reset, formState, setError } = useForm<InviteFormState>({
    defaultValues: { email: '' },
    resolver: zodResolver(formSchema),
  })

  const { isSubmitting, errors, isDirty, isSubmitSuccessful } = formState

  const [, addProjectMember] = useMutation(projectMembershipInviteByEmailMutationFieldDocument)

  const handleUserInviteSubmit = async (data: InviteFormState) => {
    const result = await addProjectMember({ email: data.email, projectId: project.id })

    if (result.data?.projectMembershipInviteByEmail.__typename === 'UserNotFoundError') {
      const email = result.data.projectMembershipInviteByEmail.email
      setError('email', { type: 'UserNotFound', message: email })
      return
    }

    if (result.error) {
      setError('email', { message: result.error.graphQLErrors.at(0)?.message ?? result.error.message })
      return
    }
    reset()
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({}, { keepValues: true })
    }
  }, [isSubmitSuccessful, reset])

  const inviteLink = `${process.env.NEXTAUTH_URL}/projects/join/${project.inviteKey}`
  const session = useSession()
  const body = `Hello,\r\rWe would like to invite you to join ${
    project.title
  } on Timebook. It's a website that helps you track your working hours efficiently.\rTo join, simply follow this link ${inviteLink}. Once you've done that, you'll be added to the project and can start tracking your hours.\r\rBest regards,\r${
    session.data?.user.name ?? 'Admin'
  }`

  const emailErrorMessage =
    errors.email?.type === 'UserNotFound' ? (
      <a
        href={`mailto:${errors.email.message}?subject=Join ${
          project.title
        } project on Timebook!&body=${encodeURIComponent(body)}`}
        className="underline"
      >
        Click to send the invitation via E-Mail
      </a>
    ) : (
      errors.email?.message
    )

  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit(handleUserInviteSubmit)}>
      <InputField
        {...register('email')}
        disabled={isSubmitting}
        errorMessage={emailErrorMessage}
        type="email"
        placeholder="Paste e-mail address here to invite someone"
        isDirty={isDirty}
      />

      <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-sm">
        <BiPlus />
        Add member
      </button>
    </form>
  )
}
