import { builder } from '../builder'

export enum ProjectFilter {
  ALL,
  ACTIVE,
  PAST,
  FUTURE,
  ARCHIVED,
  ACTIVE_OR_ARCHIVED,
}

export const ProjectFilterEnum = builder.enumType(ProjectFilter, { name: 'ProjectFilter' })
