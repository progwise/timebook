import { builder } from '../builder'

export enum OrganizationFilter {
  ALL,
  ACTIVE,
  ARCHIVED,
  ACTIVE_OR_ARCHIVED,
}

export const OrganizationFilterEnum = builder.enumType(OrganizationFilter, { name: 'OrganizationFilter' })
