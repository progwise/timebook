/*
  Warnings:

  - You are about to drop the `LockedTask` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LockedTask" DROP CONSTRAINT "LockedTask_taskId_fkey";

-- DropForeignKey
ALTER TABLE "LockedTask" DROP CONSTRAINT "LockedTask_userId_fkey";

-- DropTable
DROP TABLE "LockedTask";
