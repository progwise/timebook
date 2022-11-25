import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { FiCopy } from 'react-icons/fi'
import { z } from 'zod'

import { Button, InputField } from '@progwise/timebook-ui'
import { teamInputValidations } from '@progwise/timebook-validations'

import { TeamFragment, TeamInput, Theme, useTeamCreateMutation, useTeamUpdateMutation } from '../../generated/graphql'

interface TeamFormProps {
  team?: TeamFragment
}

const teamInputSchema: z.ZodType<TeamInput> = teamInputValidations.extend({ theme: z.nativeEnum(Theme).nullish() })

const FormField: React.FC<{ className?: string; children: ReactNode }> = ({ children, className }) => (
  <label className={`flex flex-row flex-wrap gap-2 ${className}`}>{children}</label>
)

export const TeamForm = (props: TeamFormProps): JSX.Element => {
  const { team } = props
  const { register, handleSubmit, formState } = useForm<TeamInput>({
    defaultValues: {
      title: team?.title,
      slug: team?.slug,
      theme: team?.theme,
    },
    resolver: zodResolver(teamInputSchema),
  })
  const router = useRouter()
  const [, updateTeam] = useTeamUpdateMutation()
  const [, createTeam] = useTeamCreateMutation()

  const handleTeamSave = async (data: TeamInput) => {
    const { error } = await (team ? updateTeam({ data, id: team.id }) : createTeam({ data }))
    const errorMesseage = error?.graphQLErrors.at(0)?.message

    if (errorMesseage === 'Too many teams') {
      toast.error('No more Teams allowed. You need more? Buy timebook Pro for 20$ a month')
      return
    }

    if (error?.networkError) {
      toast.error('Please check your internet conection')
      return
    }

    if (error) {
      toast.error('unexpectet Error. Please try again')
      return
    }

    router.push(`/${data.slug}/team`)
  }

  const handleDismiss = () => {
    router.push(`/teams`)
  }

  const handleCopyClick = () => {
    navigator.clipboard.writeText(`${process.env.NEXTAUTH_URL}/${team?.slug}/team/invite/${team?.inviteKey}`)
  }

  return (
    <form className="flex flex-col gap-2 pt-4" onSubmit={handleSubmit(handleTeamSave)}>
      <FormField>
        <InputField
          label="Team name"
          className="w-full dark:border-white dark:bg-slate-800 dark:text-white"
          variant="primary"
          placeholder="Please enter the team name"
          {...register('title')}
          errorMessage={formState.errors.title?.message}
        />
      </FormField>

      <FormField>
        <InputField
          label="Slug"
          variant="primary"
          className="w-full dark:border-white dark:bg-slate-800 dark:text-white"
          placeholder="This team is accessible on https://tb.com/[slug]"
          disabled={formState.isSubmitting}
          {...register('slug')}
          errorMessage={formState.errors.slug?.message}
        />
      </FormField>
      {team && (
        <>
          <FormField>
            <InputField
              label="Invitation link"
              className="flex-1"
              readOnly
              variant="primary"
              name="tbInvitationLink"
              value={`${process.env.NEXTAUTH_URL}/${team.slug}/team/invite/${team.inviteKey}`}
            />
            <FiCopy className="right-0 cursor-pointer text-2xl text-gray-500" onClick={handleCopyClick} />
          </FormField>
        </>
      )}

      <div className="start mt-4 flex flex-row justify-between gap-2 sm:justify-end">
        {/* Dismiss button available only during the creation of a new team */}
        {!team ? (
          <Button variant="secondary" onClick={handleDismiss}>
            Dismiss
          </Button>
        ) : undefined}
        <Button variant="primary" type="submit">
          Save
        </Button>
      </div>
    </form>
  )
}
