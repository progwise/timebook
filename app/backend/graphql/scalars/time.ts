import { TimeResolver } from 'graphql-scalars'
import { asNexusMethod } from 'nexus'

export const TimeScalar = asNexusMethod(TimeResolver, 'time')
