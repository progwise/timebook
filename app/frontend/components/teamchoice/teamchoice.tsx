import { useRouter } from 'next/router'

import { BsFillArrowRightSquareFill } from 'react-icons/bs'
import { useTeamsQuery } from '../../generated/graphql'
import { Button } from '../button/button'

export const TeamChoiceForm = (): JSX.Element => {
  const [{ data: teamsData }] = useTeamsQuery()

  const router = useRouter()

  const handleSwitchProfile = async (teamSlug: string) => {
    await router.push(`/${teamSlug}/team`)
  }

  return (
    <>
      {teamsData?.teams.map((team) => {
        return (
          <div className="rounded-lg border-2 border-gray-400 bg-gray-100 px-4" key={team.id}>
            <h2 className="text-md  font-bold text-gray-700">{team.title}</h2>
            <Button
              variant="tertiary_blue"
              onClick={() => {
                handleSwitchProfile(team.slug)
              }}
            >
              Select this team
              <BsFillArrowRightSquareFill />
            </Button>
          </div>
        )
      })}
    </>
  )
}
