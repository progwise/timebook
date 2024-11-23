import { builder } from '../builder'

export const InvoiceItem = builder.prismaObject('InvoiceItem', { fields: (t) => ({ id: t.exposeID('id') }) })
