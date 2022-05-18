import { Button } from '../button/button'
import { InputField } from '../inputField/inputField'
import { TeamFragment, TeamInput, Theme, useTeamCreateMutation, useTeamUpdateMutation } from '../../generated/graphql'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/router'

interface TeamFormProps {
  team?: TeamFragment
}

const teamInputSchema: yup.SchemaOf<TeamInput> = yup.object({
  slug: yup.string().trim().required().min(1).max(50),
  theme: yup.mixed<Theme>().oneOf(Object.values(Theme)),
  title: yup.string().trim().required().min(1).max(50),
})

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
    <form onSubmit={handleSubmit(handleTeamSave)}>
      <label>
        Team name
        <InputField variant="primary" placeholder="Please enter the team name" {...register('title')} />
      </label>
      <ErrorMessage name="title" errors={formState.errors} as={<span className="text-red-700" />} />
      <label>
        <span>Slug</span>
        <InputField
          variant="primary"
          placeholder="This team is accessible on https://tb.com/[slug]"
          disabled={formState.isSubmitting}
          {...register('slug')}
        />
      </label>
      <ErrorMessage name="slug" errors={formState.errors} as={<span className="text-red-700" />} />
      {team && (
        <label>
          <span>Invitation link</span>
          <InputField
            readOnly
            variant="primary"
            name="tbInvitationLink"
            value={`${process.env.NEXTAUTH_URL}/${team.slug}/team/invite/${team.inviteKey}`}
          />
        </label>
      )}

      <div className="flex space-x-6">
        <Button variant="primary" type="submit">
          Save
        </Button>
        <Button variant="tertiary">Dismiss</Button>
        {(createTeamResult.error || updateTeamResult.error) && <span className="text-red-600">Fehler !!! </span>}
      </div>
    </form>
  )
}
