/*
  Warnings:

  - You are about to drop the column `inviteAcceptedAt` on the `ProjectMembership` table. All the data in the column will be lost.
  - Made the column `invitedAt` on table `ProjectMembership` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProjectMembership" DROP COLUMN "inviteAcceptedAt",
ALTER COLUMN "invitedAt" SET NOT NULL;
