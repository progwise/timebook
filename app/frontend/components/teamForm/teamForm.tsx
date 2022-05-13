import { Button } from '../button/button'
import { InputField } from '../inputField/inputField'
import { TeamFragment, TeamInput, useTeamCreateMutation, useTeamUpdateMutation } from '../../generated/graphql'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { useRouter } from 'next/router'

interface TeamFormProps {
  team?: TeamFragment
}

export const TeamForm = (props: TeamFormProps): JSX.Element => {
  const { team } = props
  const { register, handleSubmit, formState } = useForm<TeamInput>({
    defaultValues: {
      title: team?.title,
      slug: team?.slug,
      theme: team?.theme,
    },
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
        Company
        <InputField
          variant="primary"
          placeholder="Please enter the companies name"
          {...register('title', { required: 'title is required' })}
        />
      </label>
      <ErrorMessage name="title" errors={formState.errors} />
      <label>
        <span>Slug</span>
        <InputField
          variant="primary"
          placeholder="This team is accessible on https://tb.com/[slug]"
          disabled={formState.isSubmitting}
          {...register('slug', { required: 'slug is required' })}
        />
      </label>
      {team && (
        <label>
          <span>Invitation link</span>
          <InputField
            readOnly={true}
            variant="primary"
            name="tbInvitationLink"
            value={`http://localhost:3000/${team.slug}/team/invite/${team.inviteKey}`}
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
