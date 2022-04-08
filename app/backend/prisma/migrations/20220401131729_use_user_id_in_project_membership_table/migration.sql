/*
  Warnings:

  - The primary key for the `ProjectMembership` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `teamMembershipId` on the `ProjectMembership` table. All the data in the column will be lost.
  - Added the required column `userId` to the `ProjectMembership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectMembership" DROP CONSTRAINT "ProjectMembership_teamMembershipId_fkey";

-- AlterTable
ALTER TABLE "ProjectMembership" DROP CONSTRAINT "ProjectMembership_pkey",
DROP COLUMN "teamMembershipId",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "ProjectMembership_pkey" PRIMARY KEY ("userId", "projectId");

-- AddForeignKey
ALTER TABLE "ProjectMembership" ADD CONSTRAINT "ProjectMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
