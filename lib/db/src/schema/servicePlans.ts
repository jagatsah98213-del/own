import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { servicesTable } from "./services";
import { planBadgeEnum, pricingTypeEnum } from "./enums";

export const servicePlansTable = pgTable("service_plans", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull().references(() => servicesTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  pricingType: pricingTypeEnum("pricing_type").notNull().default("ONE_TIME"),
  startingPrice: text("starting_price"),
  badge: planBadgeEnum("badge").notNull().default("NONE"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ServicePlan = typeof servicePlansTable.$inferSelect;
export type InsertServicePlan = typeof servicePlansTable.$inferInsert;
