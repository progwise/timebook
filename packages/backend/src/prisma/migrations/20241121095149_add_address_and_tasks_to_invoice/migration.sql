-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "invoiceId" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
