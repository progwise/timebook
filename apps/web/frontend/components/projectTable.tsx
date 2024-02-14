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
      id
      image
      name
    }
  }
`)

interface ProjectTableProps {
  projects: FragmentType<typeof ProjectTableItemFragment>[]
}

const MAX_NUMBER_OF_DISPLAYED_MEMBERS = 4

export const ProjectTable = (props: ProjectTableProps): JSX.Element => {
  const projects = useFragment(ProjectTableItemFragment, props.projects)

  return (
    <div className="w-full rounded-box border border-base-content/50 shadow-lg">
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
                  <Link href={`/projects/${project.id}`}>{project.title}</Link>
                </td>
                <td>
                  <div className="avatar-group -my-1 -space-x-4 rtl:space-x-reverse ">
                    {project.members.slice(0, MAX_NUMBER_OF_DISPLAYED_MEMBERS).map((member) =>
                      member.image ? (
                        <Image
                          key={member.id}
                          className="avatar"
                          width={36}
                          height={36}
                          src={member.image}
                          alt={member.image ?? 'image of the user'}
                        />
                      ) : (
                        <div key={member.id} className="avatar placeholder">
                          <div className="w-9 rounded-full bg-neutral text-neutral-content">
                            <span className="text-2xl">{member.name?.at(0)}</span>
                          </div>
                        </div>
                      ),
                    )}
                    {project.members.length > MAX_NUMBER_OF_DISPLAYED_MEMBERS && (
                      <div className="avatar placeholder">
                        <div className="w-9 rounded-full bg-neutral text-neutral-content">
                          <span>+{project.members.length - MAX_NUMBER_OF_DISPLAYED_MEMBERS}</span>
                        </div>
                      </div>
                    )}
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
