/*
  Warnings:

  - You are about to drop the `WeekComment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WeekComment" DROP CONSTRAINT "WeekComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "WeekComment" DROP CONSTRAINT "WeekComment_workHourId_fkey";

-- AlterTable
ALTER TABLE "WorkHour" ADD COLUMN     "comment" TEXT;

-- DropTable
DROP TABLE "WeekComment";
