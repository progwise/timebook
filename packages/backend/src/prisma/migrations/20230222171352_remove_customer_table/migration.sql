/*
  Warnings:

  - You are about to drop the column `customerId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_customerId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "customerId";

-- DropTable
DROP TABLE "Customer";
