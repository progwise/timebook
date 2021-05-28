import {makeSchema, objectType, queryType} from 'nexus';
import { join } from 'path'

const Project = objectType(
  {
    name: 'Project',
    definition: (t) => {
      t.id('id', {description: 'identifies the project'})
      t.string('title', {})
    }
  }
)

const Query = objectType({
  name: 'Query',
  definition: (t) => {
    t.list.field('projects', {type: Project
      , resolve: async (source, args, context, info) =>  {
        const projectList = await context.prisma.project.findMany()
        return projectList.map(project => ({id: project.id.toString(), title: project.title }))
      }
    })
  }
})

export const schema = makeSchema({
  types: [Query],
  outputs: {
    typegen: join(__dirname, 'generated', 'nexus-typegen.ts'),
    schema:  join(__dirname, 'generated', 'schema.graphql'),
  },
  contextType: {
    module: join(__dirname, '..', 'context.ts'),
    export: 'IContext'
  },
  nonNullDefaults: {input: true, output: true}
})
