-- prepare data
select max("id") as "id", max("updatedAt") as "updatedAt", "date", "userId", "taskId", sum("duration") as "duration", min("start") as "start", max("end") as "end" into temp table "temp_workhour" from  "WorkHour" group by "date", "userId", "taskId";
delete from "WorkHour";
insert into "WorkHour" ("id", "date", "userId", "taskId", "duration", "start", "end", "updatedAt")
	select "id", "date", "userId", "taskId", "duration", "start", "end", "updatedAt" from "temp_workhour";
drop table "temp_workhour";

-- CreateIndex
CREATE UNIQUE INDEX "WorkHour_date_userId_taskId_key" ON "WorkHour"("date", "userId", "taskId");
