/*
  Warnings:

  - You are about to drop the column `inviteKey` on the `Project` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Project_inviteKey_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "inviteKey";

-- CreateTable
CREATE TABLE "ProjectInvitation" (
    "id" TEXT NOT NULL,
    "invitationKey" TEXT NOT NULL,
    "expireDate" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectInvitation_invitationKey_key" ON "ProjectInvitation"("invitationKey");

-- AddForeignKey
ALTER TABLE "ProjectInvitation" ADD CONSTRAINT "ProjectInvitation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
