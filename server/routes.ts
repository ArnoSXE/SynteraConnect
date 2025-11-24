import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMessageSchema, insertFeedbackSchema, insertSalesDataSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User already exists with this email" });
      }

      if (userData.username) {
        const existingUsername = await storage.getUserByUsername(userData.username);
        if (existingUsername) {
          return res.status(400).json({ error: "Username already taken" });
        }
      }

      const user = await storage.createUser(userData);
      
      // Don't send password back
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Message routes
  app.get("/api/messages/:userId", async (req, res) => {
    try {
      const messages = await storage.getMessagesByUser(req.params.userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const messageData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Feedback routes
  app.post("/api/feedback", async (req, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse(req.body);
      const feedbackRecord = await storage.createFeedback(feedbackData);
      res.json(feedbackRecord);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  });

  app.get("/api/feedback/:userId", async (req, res) => {
    try {
      const feedbackList = await storage.getFeedbackByUser(req.params.userId);
      res.json(feedbackList);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
  });

  // Sales routes
  app.get("/api/sales/:businessId", async (req, res) => {
    try {
      const salesData = await storage.getSalesDataByBusiness(req.params.businessId);
      res.json(salesData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sales data" });
    }
  });

  app.get("/api/sales/:businessId/latest", async (req, res) => {
    try {
      const latestSales = await storage.getLatestSalesData(req.params.businessId);
      res.json(latestSales || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch latest sales data" });
    }
  });

  app.post("/api/sales", async (req, res) => {
    try {
      const salesDataInput = insertSalesDataSchema.parse(req.body);
      const salesRecord = await storage.createSalesData(salesDataInput);
      res.json(salesRecord);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create sales data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
