import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const jobLogsTable = pgTable("job_logs", {
  id: serial("id").primaryKey(),
  jobId: text("job_id").notNull(),
  stage: text("stage"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertJobLogSchema = createInsertSchema(jobLogsTable).omit({ id: true, createdAt: true });
export type InsertJobLog = z.infer<typeof insertJobLogSchema>;
export type JobLog = typeof jobLogsTable.$inferSelect;
