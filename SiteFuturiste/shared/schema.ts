import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
// ID is provided by Replit Auth, not auto-generated
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact messages table
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  budget: varchar("budget", { length: 100 }),
  projectType: varchar("project_type", { length: 100 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tags table for organizing messages
export const tags = pgTable("tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 50 }).notNull().unique(),
  color: varchar("color", { length: 20 }).notNull().default("#8B5CF6"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Message-Tags join table
export const messageTags = pgTable("message_tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
  tagId: varchar("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
});

// Response templates for quick replies
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  subject: varchar("subject", { length: 200 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Analytics page views
export const pageViews = pgTable("page_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  path: varchar("path", { length: 255 }).notNull(),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas and types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export const insertTagSchema = createInsertSchema(tags).omit({
  id: true,
  createdAt: true,
});
export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
});
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type Template = typeof templates.$inferSelect;

export type MessageTag = typeof messageTags.$inferSelect;
export type PageView = typeof pageViews.$inferSelect;
