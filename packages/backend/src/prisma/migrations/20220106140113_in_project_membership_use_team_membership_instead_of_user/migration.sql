/*
  Warnings:

  - The primary key for the `ProjectMembership` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `ProjectMembership` table. All the data in the column will be lost.
  - Added the required column `teamMembershipId` to the `ProjectMembership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectMembership" DROP CONSTRAINT "ProjectMembership_userId_fkey";

-- AlterTable
ALTER TABLE "ProjectMembership" DROP CONSTRAINT "ProjectMembership_pkey",
DROP COLUMN "userId",
ADD COLUMN     "teamMembershipId" TEXT NOT NULL,
ADD CONSTRAINT "ProjectMembership_pkey" PRIMARY KEY ("teamMembershipId", "projectId");

-- AddForeignKey
ALTER TABLE "ProjectMembership" ADD CONSTRAINT "ProjectMembership_teamMembershipId_fkey" FOREIGN KEY ("teamMembershipId") REFERENCES "TeamMembership"("id") ON DELETE CASCADE ON UPDATE CASCADE;
