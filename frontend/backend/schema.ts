import path from 'path'

import { makeSchema, nullable, objectType } from 'nexus'

const Project = objectType({
    name: 'Project',
    definition: (t) => {
        t.id('id', { description: 'identifies the project' })
        t.string('title', {})
        t.field('startDate', { type: nullable('String') })
        t.field('endDate', { type: nullable('String') })
    },
})

const Query = objectType({
    name: 'Query',
    definition: (t) => {
        t.list.field('projects', {
            type: Project,
            resolve: async (source, arguments_, context) => {
                const projectList = await context.prisma.project.findMany()
                return projectList.map((project) => ({
                    id: project.id.toString(),
                    title: project.title,
                    startDate: project.startDate?.toString(),
                    endDate: project.endDate?.toString(),
                }))
            },
        })
    },
})

export const schema = makeSchema({
    types: [Query],
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
})
