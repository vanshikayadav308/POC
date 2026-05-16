import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const jobsTable = pgTable("jobs", {
  id: text("id").primaryKey(),
  filename: text("filename"),
  classNumber: text("class_number"),
  language: text("language"),
  voiceBackend: text("voice_backend"),
  transitionStyle: text("transition_style"),
  status: text("status").notNull().default("pending"),
  progress: integer("progress"),
  currentStage: text("current_stage"),
  screenplay: text("screenplay"),
  videoPath: text("video_path"),
  errorMessage: text("error_message"),
  sceneCount: integer("scene_count"),
  durationSeconds: integer("duration_seconds"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const insertJobSchema = createInsertSchema(jobsTable).omit({ createdAt: true, updatedAt: true });
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobsTable.$inferSelect;
