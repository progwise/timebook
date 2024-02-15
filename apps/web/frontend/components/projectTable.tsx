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

const MAX_NUMBER_OF_AVATARS = 5

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
            const numberOfMembersToBeDisplayed =
              MAX_NUMBER_OF_AVATARS === project.members.length ? MAX_NUMBER_OF_AVATARS : MAX_NUMBER_OF_AVATARS - 1
            return (
              <tr key={project.id}>
                <td>
                  <Link href={`/projects/${project.id}`}>{project.title}</Link>
                </td>
                <td>
                  <div className="avatar-group -space-x-3">
                    {project.members.slice(0, numberOfMembersToBeDisplayed).map((member) =>
                      member.image ? (
                        <div key={member.id} className="avatar">
                          <div className="size-9">
                            <Image
                              key={member.id}
                              width={36}
                              height={36}
                              src={member.image}
                              alt={member.image ?? 'image of the user'}
                            />
                          </div>
                        </div>
                      ) : (
                        <div key={member.id} className="avatar placeholder">
                          <div className="size-9 rounded-full bg-neutral text-neutral-content">
                            <span className="text-2xl">{member.name?.at(0)}</span>
                          </div>
                        </div>
                      ),
                    )}
                    {project.members.length > numberOfMembersToBeDisplayed && (
                      <div className="avatar placeholder">
                        <div className="w-9 rounded-full bg-neutral text-neutral-content">
                          <span>+{project.members.length - numberOfMembersToBeDisplayed}</span>
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
