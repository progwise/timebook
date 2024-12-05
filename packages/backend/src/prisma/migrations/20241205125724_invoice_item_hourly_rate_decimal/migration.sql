/*
  Warnings:

  - You are about to alter the column `hourlyRate` on the `InvoiceItem` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - Made the column `hourlyRate` on table `InvoiceItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "InvoiceItem" ALTER COLUMN "hourlyRate" SET NOT NULL,
ALTER COLUMN "hourlyRate" SET DATA TYPE DECIMAL(10,2);
