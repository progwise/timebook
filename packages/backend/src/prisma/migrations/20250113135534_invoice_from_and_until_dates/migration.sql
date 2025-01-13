/*
  Warnings:

  - Added the required column `invoiceWorkFrom` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceWorkUntil` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "invoiceWorkFrom" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "invoiceWorkUntil" TIMESTAMP(3) NOT NULL;
