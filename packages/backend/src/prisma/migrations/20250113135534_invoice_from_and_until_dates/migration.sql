-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN "invoiceWorkFrom" TIMESTAMP(3), ADD COLUMN "invoiceWorkUntil" TIMESTAMP(3);
UPDATE "Invoice" SET "invoiceWorkFrom" = "invoiceDate", "invoiceWorkUntil" = "invoiceDate" WHERE "invoiceWorkFrom" IS NULL;
ALTER TABLE "Invoice" ALTER COLUMN "invoiceWorkFrom" SET NOT NULL, ALTER COLUMN "invoiceWorkUntil" SET NOT NULL;