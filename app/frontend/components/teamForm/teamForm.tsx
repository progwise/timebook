import { useRouter } from 'next/router'
import { ChangeEvent, useState } from 'react'
import { Button } from '../button/button'
import { InputField } from '../inputField/inputField'

export const TeamForm = (props: any) => {
  const [slug, setSlug] = useState('')
  const [invitationLink, setInvitationLink] = useState('')
  const handleSaveClick = () => console.log('handleSaveClick')
  const handleSlugChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSlug(event.target.value)
    setInvitationLink(`https://tb.com${event.target.value}/team/invite `)
  }
  return (
    <form>
      <label>
        Company:
        <InputField variant="primary" name="tbCompany" placeholder="Please enter the companies name" />
      </label>
      <label>
        Slug
        <InputField
          variant="primary"
          name="tbSlug"
          placeholder="This team is accsessible on https://tb.com/[slug]"
          onChange={handleSlugChange}
          value={slug}
        />
      </label>
      <label>
        Invitation link
        <InputField variant="primary" name="tbInvitationLink" value={invitationLink} />
      </label>
      <Button variant="primary" onClick={handleSaveClick}>
        Save
      </Button>
    </form>
  )
}
