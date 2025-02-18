/* eslint-disable unicorn/no-null */
import { builder } from '../../builder'
import { prisma } from '../../prisma'
import { InvoiceSendInput } from '../invoiceSendInput'

builder.mutationField('withdrawInvoice', (t) =>
  t.prismaField({
    type: 'Invoice',
    description: 'Withdraw an invoice',
    args: {
      data: t.arg({ type: InvoiceSendInput }),
    },
    authScopes: async (_source, { data: { organizationId } }) => ({ isAdminByOrganization: organizationId.toString() }),

    resolve: (query, _source, { data: { invoiceId } }) => {
      return prisma.invoice.update({
        ...query,
        data: { invoiceStatus: 'DRAFT', sendDate: null },
        where: { id: invoiceId.toString() },
      })
    },
  }),
)
