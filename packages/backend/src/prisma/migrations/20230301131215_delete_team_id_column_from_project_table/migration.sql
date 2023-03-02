/*
  Warnings:

  - You are about to drop the column `teamId` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_teamId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "teamId";

-- Delete all projects without members
DELETE FROM "Project" 
	WHERE (SELECT COUNT("ProjectMembership"."userId") FROM "ProjectMembership" WHERE "ProjectMembership"."projectId" = "Project"."id" ) = 0;