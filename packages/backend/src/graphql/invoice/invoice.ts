import { builder } from "../builder";

export const Invoice = builder.prismaObject("Invoice", {
    fields: (t) => ({id: t.exposeID('id')})})
    