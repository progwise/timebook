/*
  Warnings:

  - You are about to drop the column `role` on the `OrganizationMembership` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `ProjectMembership` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrganizationMembership" DROP COLUMN "role",
ADD COLUMN     "organizationRole" "Role" NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "ProjectMembership" DROP COLUMN "role",
ADD COLUMN     "projectRole" "Role" NOT NULL DEFAULT 'MEMBER';
