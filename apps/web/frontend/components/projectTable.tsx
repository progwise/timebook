import Image from 'next/image'
import Link from 'next/link'

import { FragmentType, graphql, useFragment } from '../generated/gql'

export const ProjectTableItemFragment = graphql(`
  fragment ProjectTableItem on Project {
    id
    title
    startDate
    endDate
    members {
      image
    }
  }
`)

interface ProjectTableProps {
  projects: FragmentType<typeof ProjectTableItemFragment>[]
}

export const ProjectTable = (props: ProjectTableProps): JSX.Element => {
  const projects = useFragment(ProjectTableItemFragment, props.projects)

  return (
    <div className="w-full rounded-box border border-base-content/50 shadow-lg">
      <table className="table">
        <thead className="text-lg text-base-content">
          <tr>
            <th>Name</th>
            <th>Duration</th>
            <th />
          </tr>
        </thead>
        <tbody className="text-base">
          {projects.map((project) => {
            return (
              <tr key={project.id}>
                <td className="flex ">
                  <Link href={`/projects/${project.id}`}>{project.title}</Link>
                  <div className="avatar-group -my-1 -space-x-4 rtl:space-x-reverse ">
                    {project.members.map((member, index) => (
                      <Image
                        key={index}
                        className="avatar"
                        width={36}
                        height={32}
                        src={member.image ?? 'image of the user'}
                        alt={member.image ?? 'image of the user'}
                      />
                    ))}
                  </div>
                </td>
                <td>
                  {project.startDate} - {project.endDate}
                </td>
                <td className="text-right">
                  <Link className="btn btn-outline btn-sm" href={`/projects/${project.id}`}>
                    Details
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
