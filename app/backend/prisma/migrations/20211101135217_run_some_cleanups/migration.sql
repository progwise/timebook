/*
  Warnings:

  - You are about to drop the column `hours` on the `WorkHour` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `WorkHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WorkHour` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "endDate" SET DATA TYPE DATE,
ALTER COLUMN "startDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "WorkHour" DROP COLUMN "hours",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "duration" TIME NOT NULL,
ADD COLUMN     "end" TIME,
ADD COLUMN     "start" TIME,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "date" SET DATA TYPE DATE;
