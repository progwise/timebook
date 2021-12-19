import { useRouter } from 'next/router'
import { useState } from 'react'
import { InputField } from '../inputField/inputField'

export const TeamForm = (props: any) => {
  const [slug, setSlug] = useState('')
  const [invitationLink, setInvitationLink] = useState('')
  console.log(slug)
  const handleSlugChange = (e: any) => {
    setSlug(e.target.value)
    setInvitationLink(`https:/${e.target.value}/team/invite `)
  }
  return (
    <form>
      <label>
        Company:
        <InputField variant="primary" name="tbCompany" placeholder="Please enter the companies name"></InputField>
      </label>
      <label>
        Slug
        <InputField
          variant="primary"
          name="tbSlug"
          placeholder="This team is accsessible on https://tb.com/[slug]"
          onChange={handleSlugChange}
          value={slug}
        ></InputField>
      </label>
      <label>
        Invitation link
        <InputField variant="primary" name="tbInvitationLink" value={invitationLink}></InputField>
      </label>
    </form>
  )
}
