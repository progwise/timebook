import { builder } from '../builder'

export enum OrganizationFilter {
  ALL,
  ACTIVE,
  ARCHIVED,
}

export const OrganizationFilterEnum = builder.enumType(OrganizationFilter, { name: 'OrganizationFilter' })
