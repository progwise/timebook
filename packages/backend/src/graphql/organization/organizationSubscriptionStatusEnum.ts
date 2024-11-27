import { builder } from '../builder'

export enum SubscriptionStatus {
  ACTIVE,
  CANCELLED,
}

export const SubscriptionStatusEnum = builder.enumType(SubscriptionStatus, {
  name: 'SubscriptionStatus',
  description: 'Status of the organization subscription',
})
