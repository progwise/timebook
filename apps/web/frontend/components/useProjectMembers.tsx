import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useQuery } from 'urql'

import { graphql, useFragment } from '../generated/gql'

const ProjectMemberFragment = graphql(`
  fragment ProjectMember on User {
    id
    name
    image
  }
`)

const MyProjectsMembersQueryDocument = graphql(`
  query MyProjectsMembers {
    myProjectsMembers {
      ...ProjectMember
    }
    user {
      id
    }
  }
`)

export const useProjectMembers = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>()
  const router = useRouter()

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId)
    router.push({
      pathname: router.pathname,
      query: { ...router.query, userId },
    })
  }

  const [{ data }] = useQuery({
    query: MyProjectsMembersQueryDocument,
  })

  const myProjectsMembersData = useFragment(ProjectMemberFragment, data?.myProjectsMembers) ?? []

  //Renders the logged in user by default
  useEffect(() => {
    const userId = router.query.userId?.toString() ?? data?.user.id
    if (userId && userId !== selectedUserId) {
      setSelectedUserId(userId)
      if (!router.query.userId) {
        router.push({
          pathname: router.pathname,
          query: { ...router.query, userId },
        })
      }
    }
  }, [router.query.userId, data?.user.id])

  return { selectedUserId, handleUserChange, myProjectsMembersData }
}
