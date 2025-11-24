import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { users, messages, feedback, salesData } from "@shared/schema";
import type { User, InsertUser, Message, InsertMessage, Feedback, InsertFeedback, SalesData, InsertSalesData } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool);

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Message operations
  getMessagesByUser(userId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Feedback operations
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getFeedbackByUser(userId: string): Promise<Feedback[]>;
  
  // Sales operations
  getSalesDataByBusiness(businessId: string): Promise<SalesData[]>;
  createSalesData(salesData: InsertSalesData): Promise<SalesData>;
  getLatestSalesData(businessId: string): Promise<SalesData | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!username) return undefined;
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getMessagesByUser(userId: string): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.userId, userId)).orderBy(desc(messages.createdAt));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(insertMessage).returning();
    return result[0];
  }

  async createFeedback(insertFeedback: InsertFeedback): Promise<Feedback> {
    const result = await db.insert(feedback).values(insertFeedback).returning();
    return result[0];
  }

  async getFeedbackByUser(userId: string): Promise<Feedback[]> {
    return await db.select().from(feedback).where(eq(feedback.userId, userId)).orderBy(desc(feedback.createdAt));
  }

  async getSalesDataByBusiness(businessId: string): Promise<SalesData[]> {
    return await db.select().from(salesData).where(eq(salesData.businessId, businessId)).orderBy(desc(salesData.date));
  }

  async createSalesData(insertSalesData: InsertSalesData): Promise<SalesData> {
    const result = await db.insert(salesData).values(insertSalesData).returning();
    return result[0];
  }

  async getLatestSalesData(businessId: string): Promise<SalesData | undefined> {
    const result = await db.select().from(salesData).where(eq(salesData.businessId, businessId)).orderBy(desc(salesData.date)).limit(1);
    return result[0];
  }
}

export const storage = new DatabaseStorage();
