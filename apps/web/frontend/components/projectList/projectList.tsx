import { z } from 'zod'

import { taskInputValidations as projectInputValidations } from '@progwise/timebook-validations'

import { FragmentType, graphql, useFragment } from '../../generated/gql'
import { ProjectInput } from '../../generated/gql/graphql'

export const ProjectListOrganizationFragment = graphql(`
  fragment ProjectListOrganization on Organization {
    id
    projects {
      id
      title
    }
  }
`)

export type ProjectFormData = Pick<ProjectInput, 'title'>

export const projectInputSchema: z.ZodSchema<ProjectFormData> = projectInputValidations.pick({
  title: true,
})

export interface ProjectListProps {
  organization: FragmentType<typeof ProjectListOrganizationFragment>
  className?: string
}

export const ProjectList = (props: ProjectListProps): JSX.Element => {
  const { className } = props
  const organization = useFragment(ProjectListOrganizationFragment, props.organization)

  return (
    <div className={className}>
      <table className="table">
        <thead className="text-lg text-base-content">
          <tr>
            <th>Projects</th>
          </tr>
        </thead>
        <tbody>
          {organization.projects.map((project) => (
            <tr key={project.id}>
              <td>{project.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
