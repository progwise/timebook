/*
  Warnings:

  - The primary key for the `WorkHour` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "WorkHour" DROP CONSTRAINT "WorkHour_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "WorkHour_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "WorkHour_id_seq";
