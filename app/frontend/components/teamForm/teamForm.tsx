import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'
import { Button } from '../button/button'
import { InputField } from '../inputField/inputField'
import { TeamFragment, TeamInput, useTeamUpdateMutation } from '../../generated/graphql'
import { useForm } from 'react-hook-form'
import { Team } from '../../../backend/graphql/team'
import { ErrorMessage } from '@hookform/error-message'

interface TeamFormProps {
  team?: TeamFragment
}

export const TeamForm = (props: TeamFormProps) => {
  const { team } = props
  const { register, handleSubmit, formState, setValue, control } = useForm<TeamInput>({
    defaultValues: {
      title: team?.title,
      slug: team?.slug,
      theme: team?.theme,
    },
  })

  const [, updateTeam] = useTeamUpdateMutation()

  const handleTeamSave = (data: TeamInput) => {
    console.log(data)
    if (team) {
      updateTeam({ data, id: team.id })
    }
  }
  return (
    <form onSubmit={handleSubmit(handleTeamSave)}>
      <label>
        Company:
        <InputField
          variant="primary"
          placeholder="Please enter the companies name"
          {...register('title', { required: 'title is required' })}
        />
      </label>
      <ErrorMessage name="title" errors={formState.errors} />
      <label>
        Slug
        <InputField
          variant="primary"
          placeholder="This team is accsessible on https://tb.com/[slug]"
          disabled={formState.isSubmitting}
          {...register('slug', { required: 'slug is required' })}
        />
      </label>
      <label>
        Invitation link
        <InputField
          variant="primary"
          name="tbInvitationLink"
          value={`https://tb.com${team?.slug}/team/invite/${team?.inviteKey}`}
        />
      </label>
      <Button variant="primary" type="submit">
        Save
      </Button>
    </form>
  )
}
