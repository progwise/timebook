-- AlterTable
ALTER TABLE "OrganizationMembership" ADD COLUMN     "organizationRole" "Role" NOT NULL DEFAULT 'ADMIN';

ALTER TABLE "OrganizationMembership" ALTER COLUMN "organizationRole" SET DEFAULT 'MEMBER';
