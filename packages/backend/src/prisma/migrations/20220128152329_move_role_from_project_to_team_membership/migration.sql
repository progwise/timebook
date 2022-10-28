/*
  Warnings:

  - You are about to drop the column `role` on the `ProjectMembership` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectMembership" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "TeamMembership" ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'MEMBER';
