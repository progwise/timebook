import { context } from "graphql/context";
import { arg, extendType, floatArg, intArg, list, makeSchema, nonNull, nullable, objectType, queryType, scalarType, stringArg } from "nexus";
import { type } from "os";
import { join, resolve } from "path";

const Project = objectType({
  name: "Project",
  definition: (t) => {
    t.id("id", { description: "identifies the project" });
    t.string("title", {});
    t.field("startDate", { type: nullable("String") });
    t.field("endDate", { type: nullable("String") });
    t.field("workhours", { type: nonNull(list(nonNull('WorkHour'))), async resolve(root, args, ctx) {
      const projectWorkHours = await ctx.prisma.workHour.findMany({
        where: { projectId: parseInt(root.id) },
      })
      const hours = projectWorkHours.map((hourEntry) => hourEntry)
      return hours
    } })
  },
});

const WorkHour = objectType({
  name: "WorkHour",
  definition: (t) => {
    t.id("id", { description: "identifies the work entry" });
    t.string("comment", {});
    t.field("date", { type: nullable("String") });
    t.field("hours", { type: nullable("String") });
  },
});

const CreateWorkHourMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.nonNull.field('createWorkHourEntry', {
      type: 'WorkHour',
      args: {
        comment: stringArg(),
        hours: nonNull(floatArg()),
        projectId: nonNull(intArg()),
        userId: nonNull(intArg()),
        date: nonNull(stringArg({})),
      },
      resolve: async (root, args, context) => {
        const item = {
          data: {
            hours: args['hours'],
            comment: args['comment'],
            projectId: args['projectId'],
            userId: args['userId'],
            date: new Date(args['date'])
        }}
        await context.prisma.workHour.create(item)
        return item
      }
    })
  }
})

const Query = extendType({
  type: "Query",
  definition: (t) => {
    t.list.field("projects", {
      type: Project,
      resolve: async (source, args, context, info) => {
        const projectList = await context.prisma.project.findMany();
        return projectList.map((project) => ({
          id: project.id.toString(),
          title: project.title,
          startDate: project.startDate,
          endDate: project.endDate,
        }));
      },
    });
    t.list.field("workhours", {
      type: WorkHour,
      resolve: async (source, args, context, info) => {
        const workHourList = await context.prisma.workHour.findMany();
        return workHourList.map((workHourEntry) => ({
          id: workHourEntry.id.toString(),
          comment: workHourEntry.comment,
          date: workHourEntry.date,
          hours: workHourEntry.hours
        }));
      },
    });
  },
});

export const schema = makeSchema({
  types: [Query, CreateWorkHourMutation],
  outputs: {
    typegen: join(__dirname, "generated", "nexus-typegen.ts"),
    schema: join(__dirname, "generated", "schema.graphql"),
  },
  contextType: {
    module: join(__dirname, "..", "context.ts"),
    export: "IContext",
  },
  nonNullDefaults: { input: true, output: true },
});
