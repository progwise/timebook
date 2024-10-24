-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "paypalPlanId" TEXT,
ADD COLUMN     "subscriptionExpiresAt" TIMESTAMP(3);
