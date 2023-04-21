/*
  Warnings:

  - A unique constraint covering the columns `[inviteKey]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Made the column `inviteKey` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/

UPDATE "Project" p SET "inviteKey" = md5(random()::text) WHERE p."inviteKey" IS NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "inviteKey" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_inviteKey_key" ON "Project"("inviteKey");
