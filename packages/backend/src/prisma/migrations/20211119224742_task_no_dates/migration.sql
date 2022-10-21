/*
  Warnings:

  - You are about to drop the column `endDate` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "endDate",
DROP COLUMN "startDate";

-- RenameIndex
ALTER INDEX "Account_provider_providerAccountId_key" RENAME TO "Account.provider_providerAccountId_unique";

-- RenameIndex
ALTER INDEX "Session_sessionToken_key" RENAME TO "Session.sessionToken_unique";

-- RenameIndex
ALTER INDEX "User_email_key" RENAME TO "User.email_unique";

-- RenameIndex
ALTER INDEX "VerificationToken_identifier_token_key" RENAME TO "VerificationToken.identifier_token_unique";

-- RenameIndex
ALTER INDEX "VerificationToken_token_key" RENAME TO "VerificationToken.token_unique";
