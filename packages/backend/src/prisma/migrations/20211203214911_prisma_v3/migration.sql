-- RenameIndex
ALTER INDEX "Account.provider_providerAccountId_unique" RENAME TO "Account_provider_providerAccountId_key";

-- RenameIndex
ALTER INDEX "Session.sessionToken_unique" RENAME TO "Session_sessionToken_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "VerificationToken.identifier_token_unique" RENAME TO "VerificationToken_identifier_token_key";

-- RenameIndex
ALTER INDEX "VerificationToken.token_unique" RENAME TO "VerificationToken_token_key";
