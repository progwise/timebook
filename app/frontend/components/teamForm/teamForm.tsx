import { Button } from '../button/button'
import { InputField } from '../inputField/inputField'
import { TeamFragment, TeamInput, Theme, useTeamCreateMutation, useTeamUpdateMutation } from '../../generated/graphql'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

interface TeamFormProps {
  team?: TeamFragment
}

const teamInputSchema: yup.SchemaOf<TeamInput> = yup.object({
  slug: yup.string().trim().required().min(1).max(50),
  theme: yup.mixed<Theme>().oneOf(Object.values(Theme)),
  title: yup.string().trim().required().min(1).max(50),
})

const FormField: React.FC<{ children: ReactNode }> = ({ children }) => (
  <label className="flex flex-row flex-wrap gap-2">{children}</label>
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

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(handleTeamSave)}>
      <FormField>
        <span className="w-1/3">Team name</span>
        <InputField
          variant="primary"
          className="dark:border-white dark:bg-slate-800 dark:text-white"
          placeholder="Please enter the team name"
          {...register('title')}
        />
        <ErrorMessage name="title" errors={formState.errors} as={<span className="text-red-700" />} />
      </FormField>
      <FormField>
        <span className="w-1/3">Slug</span>
        <InputField
          variant="primary"
          className="dark:border-white dark:bg-slate-800 dark:text-white"
          placeholder="This team is accessible on https://tb.com/[slug]"
          disabled={formState.isSubmitting}
          {...register('slug')}
        />
        <ErrorMessage name="slug" errors={formState.errors} as={<span className="text-red-700" />} />
      </FormField>
      {team && (
        <FormField>
          <span className="w-1/3">Invitation link</span>
          <InputField
            readOnly
            variant="primary"
            name="tbInvitationLink"
            value={`${process.env.NEXTAUTH_URL}/${team.slug}/team/invite/${team.inviteKey}`}
          />
        </FormField>
      )}

      <div className="mt-4 flex flex-row justify-center gap-2">
        <Button variant="primary" type="submit">
          Save
        </Button>
        <Button variant="tertiary">Dismiss</Button>
        {(createTeamResult.error || updateTeamResult.error) && <span className="text-red-600">Fehler !!! </span>}
      </div>
    </form>
  )
}
