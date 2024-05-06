/*
  Warnings:

  - You are about to drop the column `inviteAcceptedAt` on the `ProjectMembership` table. All the data in the column will be lost.
  - You are about to drop the column `invitedAt` on the `ProjectMembership` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectMembership" DROP COLUMN "inviteAcceptedAt",
DROP COLUMN "invitedAt",
ADD COLUMN     "invitationId" TEXT,
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "ProjectMembership" ADD CONSTRAINT "ProjectMembership_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "ProjectInvitation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
