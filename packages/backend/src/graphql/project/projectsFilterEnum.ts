import { builder } from '../builder'

export enum ProjectFilter {
  ALL,
  ACTIVE,
  PAST,
  FUTURE,
}

export const ProjectFilterEnum = builder.enumType(ProjectFilter, { name: 'ProjectFilter' })
