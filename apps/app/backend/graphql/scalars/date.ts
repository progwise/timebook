import { DateResolver } from 'graphql-scalars'
import { asNexusMethod } from 'nexus'

export const DateScalar = asNexusMethod(DateResolver, 'date')
