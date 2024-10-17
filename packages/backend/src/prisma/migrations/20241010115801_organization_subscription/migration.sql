-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "subscriptionExpiresAt" TIMESTAMP(3),
ADD COLUMN     "subscriptionStatus" BOOLEAN NOT NULL DEFAULT false;
