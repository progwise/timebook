/*
  Warnings:

  - A unique constraint covering the columns `[date,userId,taskId]` on the table `WorkHour` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkHour_date_userId_taskId_key" ON "WorkHour"("date", "userId", "taskId");
