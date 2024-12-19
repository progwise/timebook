import Link from 'next/link'

import { FragmentType, graphql, useFragment } from '../generated/gql'
import { UserLabel } from './userLabel'

export const ProjectTableItemFragment = graphql(`
  fragment ProjectTableItem on Project {
    id
    title
    startDate
    endDate
    members {
      id
      image
      name
    }
  }
`)

interface ProjectTableProps {
  projects: FragmentType<typeof ProjectTableItemFragment>[]
}

export const ProjectTable = (props: ProjectTableProps): JSX.Element => {
  const projects = useFragment(ProjectTableItemFragment, props.projects)

  return (
    <table className="table">
      <thead className="text-lg text-base-content">
        <tr>
          <th>Name</th>
          <th>Members</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody className="text-base">
        {projects.map((project) => {
          return (
            <tr key={project.id}>
              <td>
                <Link href={`/projects/${project.id}`} className="link-hover link">
                  {project.title}
                </Link>
              </td>
              <td>
                <UserLabel
                  members={project.members.map((member) => ({
                    id: member.id,
                    name: member.name ?? undefined,
                    image: member.image ?? undefined,
                  }))}
                  imageSize={36}
                  showDuration={false}
                  maxNumberOfAvatars={5}
                />
              </td>
              <td>
                {project.startDate} - {project.endDate}
              </td>
              <td className="text-right">
                <Link className="btn btn-outline btn-secondary btn-sm" href={`/projects/${project.id}`}>
                  Details
                </Link>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
