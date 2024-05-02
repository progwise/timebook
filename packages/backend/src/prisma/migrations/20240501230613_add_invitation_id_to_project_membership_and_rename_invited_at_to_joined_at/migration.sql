/*
  Warnings:

  - You are about to drop the column `invitedAt` on the `ProjectMembership` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectMembership" DROP COLUMN "invitedAt",
ADD COLUMN     "invitationId" TEXT,
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
