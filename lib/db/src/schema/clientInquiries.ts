import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { serviceCategoryEnum, inquiryStatusEnum } from "./enums";

export const clientInquiriesTable = pgTable("client_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  serviceNeeded: serviceCategoryEnum("service_needed").notNull(),
  projectDetails: text("project_details").notNull(),
  budgetRange: text("budget_range"),
  timeline: text("timeline"),
  status: inquiryStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertClientInquirySchema = createInsertSchema(clientInquiriesTable).omit({ id: true, status: true, createdAt: true });
export type InsertClientInquiry = z.infer<typeof insertClientInquirySchema>;
export type ClientInquiry = typeof clientInquiriesTable.$inferSelect;
