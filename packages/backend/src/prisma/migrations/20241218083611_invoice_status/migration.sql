-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID');

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "invoiceStatus" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "payDate" TIMESTAMP(3),
ADD COLUMN     "sendDate" TIMESTAMP(3);
