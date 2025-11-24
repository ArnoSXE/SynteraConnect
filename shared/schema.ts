import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").unique(),
  businessName: text("business_name"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  type: text("type").notNull(),
  category: text("category"),
  uniqueCode: text("unique_code"),
  whatsapp: text("whatsapp"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  text: text("text").notNull(),
  sender: text("sender").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  subject: text("subject").notNull(),
  type: text("type").notNull(),
  message: text("message").notNull(),
  email: text("email").notNull(),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const salesData = pgTable("sales_data", {
  id: serial("id").primaryKey(),
  businessId: varchar("business_id").references(() => users.id),
  date: timestamp("date").defaultNow().notNull(),
  revenue: integer("revenue").notNull(),
  conversions: integer("conversions").notNull(),
  avgOrderValue: integer("avg_order_value").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertSalesDataSchema = createInsertSchema(salesData).omit({
  id: true,
  date: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedback.$inferSelect;
export type InsertSalesData = z.infer<typeof insertSalesDataSchema>;
export type SalesData = typeof salesData.$inferSelect;
