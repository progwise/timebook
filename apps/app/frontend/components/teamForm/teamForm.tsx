import { Button, InputField } from '@progwise/timebook-ui'
import { TeamFragment, TeamInput, Theme, useTeamCreateMutation, useTeamUpdateMutation } from '../../generated/graphql'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { FiCopy } from 'react-icons/fi'

interface TeamFormProps {
  team?: TeamFragment
}

const teamInputSchema: yup.SchemaOf<TeamInput> = yup.object({
  slug: yup
    .string()
    .trim()
    .required()
    .min(1)
    .max(50)
    .matches(/^[\w\-]+$/, 'You are only allowed to use digits, characters, -, _'),
  theme: yup.mixed<Theme>().oneOf(Object.values(Theme)),
  title: yup.string().trim().required().min(1).max(50),
})

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
    resolver: yupResolver(teamInputSchema),
  })
  const router = useRouter()
  const [updateTeamResult, updateTeam] = useTeamUpdateMutation()
  const [createTeamResult, createTeam] = useTeamCreateMutation()

  const handleTeamSave = async (data: TeamInput) => {
    const { error } = await (team ? updateTeam({ data, id: team.id }) : createTeam({ data }))

    if (!error) {
      router.push(`/${data.slug}/team`)
    }
  }
  const handleCopyClick = () => {
    navigator.clipboard.writeText(`${process.env.NEXTAUTH_URL}/${team?.slug}/team/invite/${team?.inviteKey}`)
  }

  return (
    <form className="flex flex-col gap-2 pt-4" onSubmit={handleSubmit(handleTeamSave)}>
      <FormField>
        <span className=" text-sm font-semibold text-gray-500">Team name</span>
        <InputField
          className="w-full dark:border-white dark:bg-slate-800 dark:text-white"
          variant="primary"
          placeholder="Please enter the team name"
          {...register('title')}
        />
        <ErrorMessage name="title" errors={formState.errors} as={<span className="text-red-700" />} />
      </FormField>

      <FormField>
        <span className="text-sm font-semibold text-gray-500">Slug</span>
        <InputField
          variant="primary"
          className="w-full dark:border-white dark:bg-slate-800 dark:text-white"
          placeholder="This team is accessible on https://tb.com/[slug]"
          disabled={formState.isSubmitting}
          {...register('slug')}
        />
        <ErrorMessage name="slug" errors={formState.errors} as={<span className="text-red-700" />} />
      </FormField>
      {team && (
        <>
          <FormField>
            <span className=" text-sm font-semibold text-gray-500">Invitation link</span>
            <div className=" flex w-full flex-row items-center gap-2">
              <InputField
                className="flex-1"
                readOnly
                variant="primary"
                name="tbInvitationLink"
                value={`${process.env.NEXTAUTH_URL}/${team.slug}/team/invite/${team.inviteKey}`}
              />
              <FiCopy className="right-0 cursor-pointer text-2xl text-gray-500" onClick={handleCopyClick} />
            </div>
          </FormField>
        </>
      )}

      <div className="start mt-4 flex flex-row justify-between gap-2 sm:justify-end">
        <Button variant="secondary">Dismiss</Button>
        <Button variant="primary" type="submit">
          Save
        </Button>
      </div>

      {(createTeamResult.error || updateTeamResult.error) && (
        <div role="alert" className="text-center text-red-600">
          {createTeamResult.error?.message ?? updateTeamResult.error?.message ?? 'Server error, try again later'}
        </div>
      )}
    </form>
  )
}
