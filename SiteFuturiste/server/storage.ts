import {
  users,
  messages,
  tags,
  messageTags,
  templates,
  pageViews,
  type User,
  type UpsertUser,
  type Message,
  type InsertMessage,
  type Tag,
  type InsertTag,
  type Template,
  type InsertTemplate,
  type PageView,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql, count } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  getMessages(): Promise<Message[]>;
  getMessage(id: string): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: string): Promise<Message | undefined>;
  deleteMessage(id: string): Promise<boolean>;

  getTags(): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;
  deleteTag(id: string): Promise<boolean>;
  
  getMessageTags(messageId: string): Promise<Tag[]>;
  addTagToMessage(messageId: string, tagId: string): Promise<void>;
  removeTagFromMessage(messageId: string, tagId: string): Promise<void>;

  getTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, template: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: string): Promise<boolean>;

  recordPageView(path: string, userAgent?: string, referrer?: string): Promise<PageView>;
  getPageViewStats(days?: number): Promise<{
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    byPath: { path: string; count: number }[];
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getMessages(): Promise<Message[]> {
    return db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  async getMessage(id: string): Promise<Message | undefined> {
    const [message] = await db.select().from(messages).where(eq(messages.id, id));
    return message;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async markMessageAsRead(id: string): Promise<Message | undefined> {
    const [updatedMessage] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return updatedMessage;
  }

  async deleteMessage(id: string): Promise<boolean> {
    const result = await db
      .delete(messages)
      .where(eq(messages.id, id))
      .returning();
    return result.length > 0;
  }

  async getTags(): Promise<Tag[]> {
    return db.select().from(tags).orderBy(tags.name);
  }

  async createTag(tag: InsertTag): Promise<Tag> {
    const [newTag] = await db.insert(tags).values(tag).returning();
    return newTag;
  }

  async deleteTag(id: string): Promise<boolean> {
    const result = await db.delete(tags).where(eq(tags.id, id)).returning();
    return result.length > 0;
  }

  async getMessageTags(messageId: string): Promise<Tag[]> {
    const result = await db
      .select({ tag: tags })
      .from(messageTags)
      .innerJoin(tags, eq(messageTags.tagId, tags.id))
      .where(eq(messageTags.messageId, messageId));
    return result.map(r => r.tag);
  }

  async addTagToMessage(messageId: string, tagId: string): Promise<void> {
    await db.insert(messageTags).values({ messageId, tagId }).onConflictDoNothing();
  }

  async removeTagFromMessage(messageId: string, tagId: string): Promise<void> {
    await db.delete(messageTags).where(
      and(eq(messageTags.messageId, messageId), eq(messageTags.tagId, tagId))
    );
  }

  async getTemplates(): Promise<Template[]> {
    return db.select().from(templates).orderBy(desc(templates.createdAt));
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [newTemplate] = await db.insert(templates).values(template).returning();
    return newTemplate;
  }

  async updateTemplate(id: string, template: Partial<InsertTemplate>): Promise<Template | undefined> {
    const [updated] = await db
      .update(templates)
      .set(template)
      .where(eq(templates.id, id))
      .returning();
    return updated;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const result = await db.delete(templates).where(eq(templates.id, id)).returning();
    return result.length > 0;
  }

  async recordPageView(path: string, userAgent?: string, referrer?: string): Promise<PageView> {
    const [view] = await db.insert(pageViews).values({ path, userAgent, referrer }).returning();
    return view;
  }

  async getPageViewStats(days: number = 30): Promise<{
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    byPath: { path: string; count: number }[];
  }> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const startOfMonth = new Date(startOfToday);
    startOfMonth.setDate(startOfMonth.getDate() - 30);

    const [totalResult] = await db.select({ count: count() }).from(pageViews);
    const [todayResult] = await db
      .select({ count: count() })
      .from(pageViews)
      .where(gte(pageViews.createdAt, startOfToday));
    const [weekResult] = await db
      .select({ count: count() })
      .from(pageViews)
      .where(gte(pageViews.createdAt, startOfWeek));
    const [monthResult] = await db
      .select({ count: count() })
      .from(pageViews)
      .where(gte(pageViews.createdAt, startOfMonth));

    const byPathResult = await db
      .select({ 
        path: pageViews.path, 
        count: count() 
      })
      .from(pageViews)
      .where(gte(pageViews.createdAt, startOfMonth))
      .groupBy(pageViews.path)
      .orderBy(desc(count()));

    return {
      total: Number(totalResult?.count) || 0,
      today: Number(todayResult?.count) || 0,
      thisWeek: Number(weekResult?.count) || 0,
      thisMonth: Number(monthResult?.count) || 0,
      byPath: byPathResult.map(r => ({ path: r.path, count: Number(r.count) })),
    };
  }
}

export const storage = new DatabaseStorage();
