import path from 'path'
import { makeSchema } from 'nexus'
import { projectsQueryField } from './project'

export const schema = makeSchema({
    types: [projectsQueryField],
    outputs: {
        typegen: path.join(process.env.ROOT ?? '', '/backend/generated', 'nexus-typegen.ts'),
        schema: path.join(process.env.ROOT ?? '', '/backend/generated', 'schema.graphql'),
    },
    prettierConfig: path.join(process.env.ROOT ?? '', './.prettierrc.js'),
    contextType: {
        module: path.join(process.env.ROOT ?? '', '/backend', 'context.ts'),
        export: 'Context',
    },
    nonNullDefaults: { input: true, output: true },
    sourceTypes: {
        modules: [
            {
                module: '@prisma/client',
                alias: 'prisma',
            },
        ],
        mapping: {
            Project: 'prisma.Project',
        },
    },
})
