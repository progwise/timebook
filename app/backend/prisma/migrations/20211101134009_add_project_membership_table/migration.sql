/*
  Warnings:

  - You are about to drop the column `authorId` on the `Project` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_authorId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "authorId";

-- CreateTable
CREATE TABLE "ProjectMembership" (
    "invitedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "inviteAcceptedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'MEMBER',

    PRIMARY KEY ("userId","projectId")
);

-- AddForeignKey
ALTER TABLE "ProjectMembership" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMembership" ADD FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
