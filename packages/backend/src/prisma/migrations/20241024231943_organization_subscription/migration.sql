-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "paypalSubscriptionId" TEXT,
ADD COLUMN     "subscriptionExpiresAt" TIMESTAMP(3);
